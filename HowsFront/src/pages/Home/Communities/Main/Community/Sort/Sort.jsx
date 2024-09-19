import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Sort.module.css'
import { Button } from '../../../../../../components/Button/Button'
import { Search } from '../../../../../../components/Search/Search'
import {
    getHousingTypes,
    getSpaceTypes,
    getAreaSizes,
    getColors,
} from '../../../../../../api/community'
import { useAuthStore } from '../../../../../../store/store'

export const Sort = () => {
    const [housingTypes, setHousingTypes] = useState([])
    const [spaceTypes, setSpaceTypes] = useState([])
    const [areaSizes, setAreaSizes] = useState([])
    const [colors, setColors] = useState([])
    const [keyword, setKeyword] = useState('') // 검색어 상태 추가
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    // URL에서 현재 필터 상태 가져오기
    const selectedSort = searchParams.get('sort') || ''
    const selectedHousingType = searchParams.get('housingType') || ''
    const selectedSpaceType = searchParams.get('spaceType') || ''
    const selectedAreaSize = searchParams.get('areaSize') || ''
    const selectedColor = searchParams.get('color') || ''
    const searchKeyword = searchParams.get('keyword') || ''

    // 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            const housingTypesResponse = await getHousingTypes()
            setHousingTypes(housingTypesResponse)

            const spaceTypesResponse = await getSpaceTypes()
            setSpaceTypes(spaceTypesResponse)

            const areaSizesResponse = await getAreaSizes()
            setAreaSizes(areaSizesResponse)

            const colorsResponse = await getColors()
            setColors(colorsResponse)
        }
        fetchData()
    }, [])

    // 필터 선택 시 URL 업데이트
    const handleFilterChange = (filterType, value) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set(filterType, value)
        setSearchParams(newParams) // URL에 업데이트
    }

    // 선택된 필터 해제
    const removeSelectedFilter = filterType => {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete(filterType)
        setSearchParams(newParams) // URL에서 제거 후 업데이트
    }

    // 검색 실행
    const handleSearchSubmit = searchValue => {
        const newParams = new URLSearchParams(searchParams)
        if (searchValue) {
            newParams.set('keyword', searchValue) // 검색어를 URL 쿼리에 추가
        } else {
            newParams.delete('keyword') // 검색어가 없을 경우 제거
        }
        setSearchParams(newParams) // URL에 반영
        navigate(`/communities?${newParams.toString()}`) // URL로 이동
        console.log('Updated URL with keyword:', searchValue) // 검색어 로그 출력
    }

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
    return (
        <div className={styles.sortWrap}>
            <div className={styles.sortcont}>
                <div className={styles.sortBox}>
                    <select
                        name="sortType"
                        value={selectedSort}
                        onChange={e =>
                            handleFilterChange('sort', e.target.value)
                        }
                        className={styles.sortSelect}
                    >
                        <option value="default">최신순</option>
                        <option value="likes">인기순</option>
                        <option value="views">조회수순</option>
                    </select>

                    <select
                        name="housingType"
                        value={selectedHousingType}
                        onChange={e =>
                            handleFilterChange('housingType', e.target.value)
                        }
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

                    <select
                        name="spaceType"
                        value={selectedSpaceType}
                        onChange={e =>
                            handleFilterChange('spaceType', e.target.value)
                        }
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

                    <select
                        name="areaSize"
                        value={selectedAreaSize}
                        onChange={e =>
                            handleFilterChange('areaSize', e.target.value)
                        }
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

                    <select
                        name="color"
                        value={selectedColor}
                        onChange={e =>
                            handleFilterChange('color', e.target.value)
                        }
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

                {/* 선택된 필터들 표시 */}
                <div className={styles.selectedOptions}>
                    {selectedSort && selectedSort !== 'default' && (
                        <div className={styles.selectedOption}>
                            {selectedSort === 'likes' && '인기순'}
                            {selectedSort === 'views' && '조회수순'}
                            <button
                                onClick={() => removeSelectedFilter('sort')}
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
                                onClick={() =>
                                    removeSelectedFilter('housingType')
                                }
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
                                onClick={() =>
                                    removeSelectedFilter('spaceType')
                                }
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
                                onClick={() => removeSelectedFilter('areaSize')}
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
                                onClick={() => removeSelectedFilter('color')}
                            >
                                X
                            </button>
                        </div>
                    )}
                </div>
                <div className={styles.searchBox}>
                    <Search
                        placeholder="검색어를 입력하세요"
                        value={keyword} // 검색어 상태 반영
                        onSearch={searchValue =>
                            handleSearchSubmit(searchValue)
                        } // 검색 버튼 클릭 시 URL 업데이트
                        size="s"
                    />
                </div>
            </div>
            <Button size="s" title={'글쓰기'} onClick={handleWritePage} />
        </div>
    )
}
