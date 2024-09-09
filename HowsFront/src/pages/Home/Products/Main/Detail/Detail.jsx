import styles from './Detail.module.css'
import { useParams } from 'react-router-dom'
import { DetailPage } from './DetailPage/DetailPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from '../../../../../config/config';
import { addCommas } from '../../../../../commons/commons';



export const Detail = () => {
    const {product_seq} = useParams();
    const [list, setList] = useState([]);

    useEffect(()=>{
        axios.get(`${host}/product/detail/${product_seq}`).then(resp=>{
            console.log(resp)
            setList(resp.data);
        })
    },[])




    return (
        <div className={styles.contailer}>
            <div className={styles.contents}>
                {/* <p>{product_seq}</p> */}
                <div className={styles.img}>
                    <img src={list.product_thumbnail}></img>
                </div>
                <div className={styles.content}>
                    <div className={styles.product_title}>
                        <div>
                            {list.product_title}
                        </div>
                        <div>
                            <div>
                                장바구니
                            </div>
                            <div>
                                바로구매
                            </div>
                            <div>
                                <i className="bx bx-heart"></i>
                            </div>
                        </div>
                    </div>
                    <div className={styles.product_contents}>
                        <div>{list.product_contents}</div>
                        <div>내용</div>
                        <div>내용</div>
                        <div>내용</div>
                        <div>내용</div>
                    </div>
                    <div>{ addCommas (list.price || 0) } 원</div>
                </div>
            </div>
            <DetailPage/>
        </div>
    )
}