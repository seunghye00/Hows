import styles from './CsService.module.css'
import { SubCategory } from './SubCategory/SubCategory'
import { Faq } from './Faq/Faq'
import { Notice } from './Notice/Notice'
import { Event } from './Event/Event'
import { Route, Routes } from 'react-router-dom'
export const CsService = () => {
    return (
        <div className={styles.container}>
            <SubCategory />
            <Routes>
                <Route path="/*" element={<Notice />} />
                <Route path="/notice/*" element={<Notice />} />
                <Route path="/faq/*" element={<Faq />} />
                <Route path="/event/*" element={<Event />} />
            </Routes>
        </div>
    )
}
