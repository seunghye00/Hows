import styles from "./Review.module.css"

export const Review = () => {
    const list = [
        {
            product_seq: 1,
            product_title: '푹신푹신 침대',
            product_quantity: 1,
            product_category_title: '가구'
        },
        {
            product_seq: 2,
            product_title: '너무너무 졸려요',
            product_quantity: 100,
            product_category_title: '가전 및 디지털'
        },
    ]

    return (
        <div className={styles.container}>
            <div className={styles.countProducts}>
                <span>{list.length}</span>
                <span>개의 리뷰</span>
            </div>
            {
                list.map((item, i) => {
                    return (
                        <div className={styles.item} key={item.product_seq}>
                            <div className={styles.itemImage}>
                                <img src={item.product_image} alt="상품이미지" />
                            </div>
                            <div className={styles.itemInfo}>
                                <p>{item.product_title}</p>
                                <div className={styles.itemCount}>
                                    <span>{item.product_category_title}</span>
                                    <span>수량 : {item.product_quantity}</span>
                                    {/* <span>{addCommas(item.product_total_price)}원</span> */}
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}