import styles from './AddProduct.module.css'
import { Button } from '../../../../../components/Button/Button'
import { BiCamera } from 'react-icons/bi'
import { categoryList } from '../../../../../api/product'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa' // 체크박스 아이콘
import { EditorComp } from '../../../../../components/Editor/Editor'

export const AddProduct = () => {
    const [categories, setCategories] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [selectedImage, setSelectedImage] = useState(0)
    const [product, setProduct] = useState({
        product_title: '',
        price: 0,
        product_category_code: '',
        product_contents: '',
    })

    useEffect(() => {
        categoryList()
            .then(resp => {
                setCategories(resp.data)
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error)
            })
    }, [])

    const handleChangeCategory = e => {
        console.log(e.target.value)
        setProduct({ product_category_code: e.target.value })
    }

    const handleFileChange = e => {
        const files = Array.from(e.target.files)

        if (files.length + selectedFiles.length > 10) {
            Swal.fire({
                title: '경고 !',
                text: '최대 10개의 파일만 업로드할 수 있습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
            })
            return
        }

        const newFiles = files.filter(file => file.type.startsWith('image/'))
        if (newFiles.length !== files.length) {
            Swal.fire({
                title: '경고 !',
                text: '이미지 파일만 선택 가능합니다.',
                icon: 'warning',
                confirmButtonText: '확인',
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

    const handleSubmit = () => {
        console.log(product)
        console.log(selectedImage)

        if (
            !product.product_title ||
            !product.product_category_code ||
            !product.product_contents ||
            !product.price
        ) {
            Swal.fire({
                title: '경고 !',
                text: '모든 필드를 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인',
            })
            return
        }

        const formData = new FormData()
        formData.append('product_title', product.product_title)
        formData.append('price', product.price)
        formData.append('product_category_code', product.product_category_code)
        formData.append('product_contents', product.product_contents)

        selectedFiles.forEach((file, index) => {
            formData.append(`images[${index}]`, file)
            console.log(index, file)
        })

        // 대표 이미지가 선택된 경우
        if (selectedImage !== null) {
            formData.append('thumNaimIndex', selectedImage)
        }

        // 서버에 데이터를 전송하는 로직을 추가하세요
        console.log('제출할 데이터:', formData)

        // 예시로 간단히 Swal을 사용해 성공 메시지 표시
        Swal.fire({
            title: '성공!',
            text: '상품이 추가되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
        })
    }

    return (
        <>
            <div className={styles.btns}>
                <Button size={'s'} title={'완료'} onClick={handleSubmit} />
                <Button size={'s'} title={'취소'} />
            </div>
            <div className={styles.container}>
                <div className={styles.imgs}>
                    <span className={styles.addBtn}>
                        <input
                            type="file"
                            id="image"
                            onChange={handleFileChange}
                            multiple
                        />
                        <label htmlFor="image">
                            <BiCamera size={40} />
                        </label>
                        <div className={styles.imgNum}>
                            <span>{selectedFiles.length}</span> / 10
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
                    <input type="text" placeholder="상품명을 입력해주세요" />
                    <input
                        type="number"
                        placeholder="상품 금액을 입력해주세요"
                    />
                </div>
                <div className={styles.writeWrap}>
                    <EditorComp />
                </div>
            </div>
        </>
    )
}
