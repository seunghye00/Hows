import React, { useState, useEffect } from 'react'
import styles from './Sort.module.css'
import { host } from '../../../../../config/config' // axios를 사용하여 API 호출
import axios from 'axios'

export const Sort = () => {
    const [housingTypes, setHousingTypes] = useState([])
    const [spaceTypes, setSpaceTypes] = useState([])
    const [areaSizes, setAreaSizes] = useState([])
    const [colors, setColors] = useState([])

    // 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 각각의 API를 호출하여 데이터 가져오기
                const housingTypesResponse = await axios.get(
                    `${host}/option/housing-types`
                )
                setHousingTypes(housingTypesResponse.data)

                const spaceTypesResponse = await axios.get(
                    `${host}/option/space-types`
                )
                setSpaceTypes(spaceTypesResponse.data)

                const areaSizesResponse = await axios.get(
                    `${host}/option/area-size`
                )
                setAreaSizes(areaSizesResponse.data)

                const colorsResponse = await axios.get(`${host}/option/colors`)
                setColors(colorsResponse.data)
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }

        fetchData()
    }, [])

    return (
        <div className={styles.sortWrap}>
            <div className={styles.sortBox}>
                {/* 주거 형태 선택 */}
                <select name="housingType">
                    <option value="">주거 형태 선택</option>
                    {housingTypes.map(type => (
                        <option
                            key={type.housing_type_code}
                            value={type.housing_type_code}
                        >
                            {type.housing_type_title}
                        </option>
                    ))}
                </select>

                {/* 공간 선택 */}
                <select name="spaceType">
                    <option value="">공간 선택</option>
                    {spaceTypes.map(type => (
                        <option
                            key={type.space_type_code}
                            value={type.space_type_code}
                        >
                            {type.space_type_title}
                        </option>
                    ))}
                </select>

                {/* 평수 선택 */}
                <select name="areaSize">
                    <option value="">평수 선택</option>
                    {areaSizes.map(size => (
                        <option
                            key={size.area_size_code}
                            value={size.area_size_code}
                        >
                            {size.area_size_title}
                        </option>
                    ))}
                </select>

                {/* 컬러 선택 */}
                <select name="color">
                    <option value="">컬러 선택</option>
                    {colors.map(color => (
                        <option key={color.color_code} value={color.color_code}>
                            {color.color_title}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.writeBtn}></div>
        </div>
    )
}
