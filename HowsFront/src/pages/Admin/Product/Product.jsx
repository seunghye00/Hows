import styles from './Product.module.css'
import { Routes, Route } from 'react-router-dom'
import Title from '../../../components/Title/Title'
import { Order } from './Order/Order'
import { ViewList } from './List/ViewList/ViewList'
import { ModifyList } from './List/ModifyList/ModifyList'
import { Delivery } from './Delivery/Delivery'
import { Return } from './Return/Return'
import { AddProduct } from './List/AddProduct/AddProduct'

export const Product = () => {
    return (
        <Routes>
            <Route
                path="/viewList"
                element={
                    <>
                        <Title title={'상품 목록 조회'} />
                        <ViewList />
                    </>
                }
            />
            <Route
                path="/modifyList"
                element={
                    <>
                        <Title title={'상품 정보 수정'} />
                        <ModifyList />
                    </>
                }
            />
            <Route
                path="/addProduct"
                element={
                    <>
                        <Title title={'상품 등록'} />
                        <AddProduct />
                    </>
                }
            />
            <Route
                path="/order"
                element={
                    <>
                        <Title title={'주문 관리'} />
                        <Order />
                    </>
                }
            />
            <Route
                path="/delivery"
                element={
                    <>
                        <Title title={'배송 관리'} />
                        <Delivery />
                    </>
                }
            />
            <Route
                path="/return"
                element={
                    <>
                        <Title title={'반품 관리'} />
                        <Return />
                    </>
                }
            />
        </Routes>
    )
}
