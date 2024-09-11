import { Routes, Route } from 'react-router-dom'
import Title from '../../../components/Title/Title'
import { Order } from './Order/Order'
import { Delivery } from './Delivery/Delivery'
import { Return } from './Return/Return'
import { AddProduct } from './List/AddProduct/AddProduct'
import { ModifyProduct } from './List/ModifyProduct/ModifyProduct'
import { List } from './List/List'

export const Product = () => {
    return (
        <Routes>
            <Route
                path="/list"
                element={
                    <>
                        <Title title={'상품 목록 조회'} />
                        <List />
                    </>
                }
            />
            <Route
                path="/modifyProduct"
                element={
                    <>
                        <Title title={'상품 정보 수정'} />
                        <ModifyProduct />
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
