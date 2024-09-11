import React, { useState, useEffect } from 'react'
import styles from './Sort.module.css'
import { host } from '../../../../../../config/config' // axios를 사용하여 API 호출
import axios from 'axios'
import { Button } from '../../../../../../components/Button/Button'
import { Search } from '../../../../../../components/Search/Search'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../../../../store/store' // 로그인 상태 확인을 위한 store
import {
    getHousingTypes,
    getSpaceTypes,
    getAreaSizes,
    getColors,
} from '../../../../../../api/community' // 분리된 API 호출 함수들

export const Sort = () => {
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const [housingTypes, setHousingTypes] = useState([])
    const [spaceTypes, setSpaceTypes] = useState([])
    const [areaSizes, setAreaSizes] = useState([])
    const [colors, setColors] = useState([])
    const [selectedSort, setSelectedSort] = useState('') // 정렬 상태
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
                const housingTypesResponse = await getHousingTypes()
                setHousingTypes(housingTypesResponse)

                const spaceTypesResponse = await getSpaceTypes()
                setSpaceTypes(spaceTypesResponse)

                const areaSizesResponse = await getAreaSizes()
                setAreaSizes(areaSizesResponse)

                const colorsResponse = await getColors()
                setColors(colorsResponse)
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }

        fetchData()
    }, [])

    // 글쓰기 버튼 클릭 시 페이지 이동 함수
    const handleWritePage = () => {
        if (!isAuth) {
            // 로그인되지 않았으면 로그인 페이지로 리다이렉트
            navigate('/signIn', { state: { from: '/communities/post' } })
            // 'from'으로 돌아가야할 링크를 저장, 로그인 후 다시 리다이렉트될 수 있도록 설정
        } else {
            // 로그인되어 있으면 글쓰기 페이지로 이동
            navigate('/communities/post')
        }
    }

    // 선택 해제 함수
    const removeSelectedOption = optionType => {
        if (optionType === 'housing') setSelectedHousingType('')
        if (optionType === 'space') setSelectedSpaceType('')
        if (optionType === 'area') setSelectedAreaSize('')
        if (optionType === 'color') setSelectedColor('')
        if (optionType === 'sort') setSelectedSort('') // 정렬 필터 해제
    }

    return (
        <div className={styles.sortWrap}>
            <div className={styles.sortcont}>
                <div className={styles.sortBox}>
                    {/* 인기순/조회수순 선택 */}
                    <select
                        name="sortType"
                        value={selectedSort}
                        onChange={e => setSelectedSort(e.target.value)}
                        className={styles.sortSelect}
                    >
                        <option value="">정렬</option>
                        <option value="default">최신순</option>
                        <option value="popular">인기순</option>
                        <option value="views">조회수순</option>
                    </select>
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
                    {/* 정렬 필터 표시 */}
                    {selectedSort && selectedSort !== 'default' && (
                        <div className={styles.selectedOption}>
                            {selectedSort === 'popular' && '인기순'}
                            {selectedSort === 'views' && '조회수순'}
                            <button
                                onClick={() => removeSelectedOption('sort')}
                            >
                                X
                            </button>
                        </div>
                    )}

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
                                X
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
