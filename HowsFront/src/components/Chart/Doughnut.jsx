import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement, // ArcElement를 추가
} from 'chart.js'
import { getProductNumByCategory } from '../../api/product'

// Doughnut 차트를 위해 ArcElement 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement)

export const DoughnutChart = ({ lastSyncTime }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '상품 수',
                data: [],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    })
    const [loading, setLoading] = useState(true) // 로딩 상태 추가
    const [error, setError] = useState(null) // 에러 상태 추가

    useEffect(() => {
        getProductNumByCategory()
            .then(resp => {
                const data = resp.data
                if (data && Array.isArray(data)) {
                    const labels = data.map(item => item.CATEGORY_TITLE.trim()) // 카테고리 제목
                    const values = data.map(item => item.PRODUCT_COUNT) // 상품 수

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: '상품 수',
                                data: values,
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(255, 99, 132, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(255, 99, 132, 1)',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    })
                } else {
                    setError('데이터 형식이 올바르지 않습니다.') // 잘못된 형식 처리
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
                text: '카테고리 별 상품 수',
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

    return <Doughnut data={chartData} options={options} />
}
