import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement, // Line 차트의 선 요소
    PointElement, // Line 차트의 점 요소
} from 'chart.js'
import { getBoardNumByCategory } from '../../api/community' // 데이터를 가져오는 API 함수

// ChartJS 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement, // Line 차트의 선 요소 등록
    PointElement // Line 차트의 점 요소 등록
)

export const LineChart = ({ category }) => {
    const [chartData, setChartData] = useState({
        labels: [], // X축 레이블
        datasets: [
            {
                label: '데이터 라벨',
                data: [], // Y축 데이터
                borderColor: 'rgba(75, 192, 192, 1)', // 선 색상
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // 배경 색상
                borderWidth: 2,
                tension: 0.1, // 선의 곡률 조정
            },
        ],
    })

    useEffect(() => {
        getBoardNumByCategory()
            .then(resp => {
                console.log(resp.data)
                let data
                let labels

                switch (category) {
                    case 'areaType':
                        data = resp.data.postCountByAreaType
                        labels = data.map(item => item.AREA_SIZE_TITLE)
                        break
                    case 'housingType':
                        data = resp.data.postCountByHousingType
                        labels = data.map(item => item.HOUSING_TYPE_TITLE)
                        break
                    case 'spaceType':
                        data = resp.data.postCountBySpaceType
                        labels = data.map(item => item.SPACE_TYPE_TITLE)
                        break
                    case 'color':
                        data = resp.data.postCountByColor
                        labels = data.map(item => item.COLOR_TITLE)
                        break
                }

                const dataValues = data ? data.map(item => item.POST_COUNT) : []

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: '게시글 수',
                            data: dataValues,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 2,
                            tension: 0.1,
                        },
                    ],
                })
            })
            .catch(error => {
                console.error('Error fetching chart data:', error)
            })
    }, [category])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '카테고리별 게시글 수',
            },
        },
    }

    return <Line data={chartData} options={options} />
}
