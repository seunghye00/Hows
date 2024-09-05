import React, { useState, useEffect } from 'react'
import styles from './Sort.module.css'
import { host } from '../../../../../config/config' // axios를 사용하여 API 호출
import axios from 'axios'
import { Button } from '../../../../../components/Button/Button'
import { Search } from '../../../../../components/Search/Search'
import { useNavigate } from 'react-router-dom'

export const Sort = () => {
    const [housingTypes, setHousingTypes] = useState([])
    const [spaceTypes, setSpaceTypes] = useState([])
    const [areaSizes, setAreaSizes] = useState([])
    const [colors, setColors] = useState([])
    const navigate = useNavigate() // 페이지 전환을 위한 훅

    // 선택된 옵션 상태
    const [selectedHousingType, setSelectedHousingType] = useState('')
    const [selectedSpaceType, setSelectedSpaceType] = useState('')
    const [selectedAreaSize, setSelectedAreaSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')

    // 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
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

    // 글쓰기 버튼 클릭 시 페이지 이동 함수
    const handleWritePage = () => {
        navigate('/community/post') // '/post' 페이지로 이동
    }

    // 선택 해제 함수
    const removeSelectedOption = optionType => {
        if (optionType === 'housing') setSelectedHousingType('')
        if (optionType === 'space') setSelectedSpaceType('')
        if (optionType === 'area') setSelectedAreaSize('')
        if (optionType === 'color') setSelectedColor('')
    }

    return (
        <div className={styles.sortWrap}>
            <div className={styles.sortcont}>
                <div className={styles.sortBox}>
                    {/* 주거 형태 선택 */}
                    <select
                        name="housingType"
                        value={selectedHousingType}
                        onChange={e => setSelectedHousingType(e.target.value)}
                    >
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
                    <select
                        name="spaceType"
                        value={selectedSpaceType}
                        onChange={e => setSelectedSpaceType(e.target.value)}
                    >
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
                    <select
                        name="areaSize"
                        value={selectedAreaSize}
                        onChange={e => setSelectedAreaSize(e.target.value)}
                    >
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
                    <select
                        name="color"
                        value={selectedColor}
                        onChange={e => setSelectedColor(e.target.value)}
                    >
                        <option value="">컬러 선택</option>
                        {colors.map(color => (
                            <option
                                key={color.color_code}
                                value={color.color_code}
                            >
                                {color.color_title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 선택한 필터들 표시 */}
                <div className={styles.selectedOptions}>
                    {selectedHousingType && (
                        <div className={styles.selectedOption}>
                            {
                                housingTypes.find(
                                    type =>
                                        type.housing_type_code ===
                                        selectedHousingType
                                )?.housing_type_title
                            }
                            <button
                                onClick={() => removeSelectedOption('housing')}
                            >
                                X
                            </button>
                        </div>
                    )}
                    {selectedSpaceType && (
                        <div className={styles.selectedOption}>
                            {
                                spaceTypes.find(
                                    type =>
                                        type.space_type_code ===
                                        selectedSpaceType
                                )?.space_type_title
                            }
                            <button
                                onClick={() => removeSelectedOption('space')}
                            >
                                X
                            </button>
                        </div>
                    )}
                    {selectedAreaSize && (
                        <div className={styles.selectedOption}>
                            {
                                areaSizes.find(
                                    size =>
                                        size.area_size_code === selectedAreaSize
                                )?.area_size_title
                            }
                            <button
                                onClick={() => removeSelectedOption('area')}
                            >
                                X
                            </button>
                        </div>
                    )}
                    {selectedColor && (
                        <div className={styles.selectedOption}>
                            {
                                colors.find(
                                    color => color.color_code === selectedColor
                                )?.color_title
                            }
                            <button
                                onClick={() => removeSelectedOption('color')}
                            >
                                <i className="bx bx-x"></i>
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.searchBox}>
                    <Search placeholder="검색어를 입력하세요" size="s" />
                </div>
            </div>
            <Button size="s" title={'글쓰기'} onClick={handleWritePage} />
        </div>
    )
}
