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

export const BarChart = ({ lastSyncTime }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '남성 회원 수',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: '여성 회원 수',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    })
    const [loading, setLoading] = useState(true) // 로딩 상태 추가
    const [error, setError] = useState(null) // 에러 상태 추가

    useEffect(() => {
        getAgeGenderDistribution()
            .then(resp => {
                const data = resp.data
                if (data && Array.isArray(data)) {
                    // AGE_RANGE 값(연령대)을 추출하고 중복 제거
                    const labels = [
                        ...new Set(data.map(item => item.AGE_RANGE)),
                    ]
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
                } else {
                    // 데이터 형식이 올바르지 않은 경우 처리
                    setError('데이터 형식이 올바르지 않습니다.')
                }
            })
            .catch(error => {
                console.log(error)
                setError('데이터를 가져오는 데 오류가 발생했습니다.') // 에러 메시지 설정
            })
            .finally(() => {
                setLoading(false) // 로딩 완료
            })
    }, [lastSyncTime])

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

    // 로딩 상태일 때 표시
    if (loading) {
        return <div>Loading...</div>
    }

    // 에러 상태일 때 표시
    if (error) {
        return <div>{error}</div>
    }

    return <Bar data={chartData} options={options} />
}
