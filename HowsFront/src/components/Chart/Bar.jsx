import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js'
import { getAgeGenderDistribution } from '../../api/member' // 데이터를 가져오는 API 함수

// ChartJS 등록
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement)

export const BarChart = () => {
    const [chartData, setChartData] = useState({
        labels: [], // 연령대 레이블
        datasets: [
            {
                label: '남성 회원 수',
                data: [], // 남성 회원 수
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: '여성 회원 수',
                data: [], // 여성 회원 수
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    })

    useEffect(() => {
        getAgeGenderDistribution()
            .then(resp => {
                console.log(resp.data)
                const data = resp.data
                // AGE_RANGE 값(연령대)을 추출하고 중복 제거
                const labels = [...new Set(data.map(item => item.AGE_RANGE))]
                const maleData = data.filter(item => item.GENDER === 'M') // 남성 회원 수
                const femaleData = data.filter(item => item.GENDER === 'F') // 여성 회원 수

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: '남성 회원 수',
                            data: maleData.map(item => item.COUNT),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: '여성 회원 수',
                            data: femaleData.map(item => item.COUNT),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        },
                    ],
                })
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '연령대별 남녀 회원 수',
            },
        },
    }

    return <Bar data={chartData} options={options} />
}
