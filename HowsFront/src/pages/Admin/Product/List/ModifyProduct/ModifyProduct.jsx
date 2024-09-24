import styles from './ModifyProduct.module.css'
import { Button } from '../../../../../components/Button/Button'
import { BiCamera } from 'react-icons/bi'
import {
    categoryList,
    addProduct,
    getProductInfo,
} from '../../../../../api/product'
import { useEffect, useState } from 'react'
import { SwalComp } from '../../../../../commons/commons'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa' // 체크박스 아이콘
import { EditorComp } from '../../../../../components/Editor/Editor'
import { useLocation, useNavigate } from 'react-router-dom'

export const ModifyProduct = product_seq => {
    const location = useLocation()
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedFiles, setSelectedFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [selectedImage, setSelectedImage] = useState(0)
    const [product, setProduct] = useState({
        product_title: '',
        price: 0,
        product_category_code: '',
        product_contents: '',
        product_thumbnail: '',
        quantity: 0,
    })

    const navi = useNavigate()

    useEffect(() => {
        getProductInfo(location.state)
            .then(resp => {
                console.log(resp.data)
                setProduct(resp.data)
                setSelectedCategory(resp.data.product_category_code)
                setPreviews([resp.data.product_thumbnail])
                setSelectedFiles([resp.data.product_thumbnail])
                categoryList()
                    .then(resp => {
                        setCategories(resp.data)
                    })
                    .catch(error => {
                        console.log('데이터 가져오기 실패: ' + error)
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const handleChangeCategory = e => {
        setSelectedCategory(e.target.value)
        setProduct(prev => ({ ...prev, product_category_code: e.target.value })) // 이전 상태를 유지하며 업데이트
    }

    const handleFileChange = e => {
        const files = Array.from(e.target.files)

        if (files.length + selectedFiles.length > 11) {
            SwalComp({
                type: 'warning',
                text: '최대 1개의 파일만 업로드할 수 있습니다.',
            })
            return
        }

        const newFiles = files.filter(file => file.type.startsWith('image/'))
        if (newFiles.length !== files.length) {
            SwalComp({
                type: 'warning',
                text: '이미지 파일만 선택 가능합니다.',
            })
            return
        }

        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles])

        const newPreviews = newFiles.map(file => URL.createObjectURL(file))
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviews])
    }

    const handleDeletePreview = index => {
        setPreviews(prevPreviews => {
            const newPreviews = prevPreviews.filter((_, i) => i !== index)
            return newPreviews
        })

        // 선택된 파일도 제거
        setSelectedFiles(prevFiles => {
            const newFiles = prevFiles.filter((_, i) => i !== index)
            return newFiles
        })

        // 미리보기 URL 해제
        URL.revokeObjectURL(previews[index])
    }

    // 대표 사진 선택
    const handleSelectImage = index => {
        setSelectedImage(index)
    }

    // 상품 정보 입력
    const handleInputProductInfo = e => {
        const { name, value } = e.target
        setProduct(prev => ({ ...prev, [name]: value }))
    }

    // 작성 완료
    const handleSubmit = () => {
        if (selectedImage === 10) {
            SwalComp({
                type: 'warning',
                text: '대표 사진을 등록해주세요.',
            })
            return
        }

        if (
            !product.product_title ||
            !product.product_category_code ||
            !product.product_contents ||
            !product.price
        ) {
            SwalComp({
                type: 'warning',
                text: '모든 필드를 입력해주세요.',
            })
            return
        }

        const formData = new FormData()
        formData.append('product_title', product.product_title)
        formData.append('price', product.price)
        formData.append('product_category_code', product.product_category_code)
        formData.append('product_contents', product.product_contents)

        selectedFiles.forEach(file => {
            formData.append('images', file, file.name)
        })

        // 대표 이미지가 선택된 경우
        formData.append('thumbNailIndex', selectedImage) // selectedImage의 index만 전송

        // 서버에 데이터를 전송하는 로직
        addProduct(formData)
            .then(resp => {
                SwalComp({
                    type: 'success',
                    text: '상품이 추가되었습니다.',
                }).then(navi('/admin/product/viewList'))
            })
            .catch(error => {
                console.error('업로드 실패 :', error)
                SwalComp({
                    type: 'error',
                    text: '상품 업로드에 실패했습니다.',
                })
            })
    }

    const handleCancel = () => {
        SwalComp({ type: 'confirm', text: '수정을 취소하시겠습니까 ?' }).then(
            result => {
                if (result.isConfirmed) {
                    navi('/admin/product/list')
                }
            }
        )
    }

    return (
        <>
            <div className={styles.btns}>
                <Button size={'s'} title={'수정'} onClick={handleSubmit} />
                <Button size={'s'} title={'취소'} onClick={handleCancel} />
            </div>
            <div className={styles.container}>
                <div className={styles.imgs}>
                    <span className={styles.addBtn}>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            multiple
                        />
                        <label htmlFor="image">
                            <BiCamera size={40} />
                        </label>
                        <div className={styles.imgNum}>
                            <span>{selectedFiles.length}</span> / 1
                        </div>
                    </span>
                    {previews.map((preview, index) => (
                        <div className={styles.addedImg} key={index}>
                            <img src={preview} alt={`Preview ${index}`} />
                            <button
                                className={styles.delBtn}
                                onClick={() => handleDeletePreview(index)}
                            >
                                &times;
                            </button>
                            <button
                                className={styles.selectBtn}
                                onClick={() => handleSelectImage(index)}
                            >
                                {selectedImage === index ? (
                                    <FaCheckSquare size={24} color="green" />
                                ) : (
                                    <FaRegSquare size={24} color="gray" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.info}>
                    <select
                        value={selectedCategory}
                        onChange={handleChangeCategory}
                    >
                        <option value="">전체</option>
                        {categories.map(category => (
                            <option
                                key={category.product_category_code}
                                value={category.product_category_code}
                            >
                                {category.product_category_title}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="상품명을 입력해주세요"
                        name="product_title"
                        value={product.product_title}
                        onChange={handleInputProductInfo}
                    />
                    <input
                        type="number"
                        placeholder="상품 수량을 입력해주세요"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleInputProductInfo}
                    />
                    <input
                        type="number"
                        placeholder="상품 금액을 입력해주세요"
                        value={product.price}
                        name="price"
                        onChange={handleInputProductInfo}
                    />
                </div>
                <div className={styles.writeWrap}>
                    <EditorComp
                        onChange={content =>
                            setProduct(prev => ({
                                ...prev,
                                product_contents: content,
                            }))
                        }
                        contents={product.product_contents}
                    />
                </div>
            </div>
        </>
    )
}
