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
    LineElement,
    PointElement
)

export const LineChart = ({ category, lastSyncTime }) => {
    const [chartData, setChartData] = useState({
        labels: [], // X축 레이블
        datasets: [
            {
                label: '게시글 수',
                data: [], // Y축 데이터
                borderColor: 'rgba(75, 192, 192, 1)', // 선 색상
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // 배경 색상
                borderWidth: 2,
                tension: 0.1, // 선의 곡률 조정
            },
        ],
    })
    const [loading, setLoading] = useState(true) // 로딩 상태 추가
    const [error, setError] = useState(null) // 에러 상태 추가

    useEffect(() => {
        setLoading(true) // 데이터 로드 시작
        getBoardNumByCategory()
            .then(resp => {
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
                    default:
                        setError('Invalid category provided.') // 잘못된 카테고리 처리
                        return
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
                setError('데이터를 가져오는 데 오류가 발생했습니다.') // 에러 메시지 설정
            })
            .finally(() => {
                setLoading(false) // 로딩 완료
            })
    }, [category, lastSyncTime])

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
        scales: {
            y: {
                beginAtZero: true, // Y축 최솟값을 0으로 설정
                ticks: {
                    stepSize: 1, // Y축 간격을 1로 설정
                },
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

    return <Line data={chartData} options={options} />
}
