import styles from './Product.module.css'
import { Routes, Route } from 'react-router-dom'
import Title from '../../../components/Title/Title'
import { Order } from './Order/Order'
import { List } from './List/List'
import { Delivery } from './Delivery/Delivery'
import { Return } from './Return/Return'

export const Product = () => {
    return (
        <Routes>
            <Route
                path="/list"
                element={
                    <>
                        <Title title={'목록 관리'} />
                        <List />
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
