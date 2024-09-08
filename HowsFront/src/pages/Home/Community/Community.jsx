import styles from './Community.module.css'
import { Main } from './Main/Main'
import { Post } from './Post/Post'
import { Modify } from './Modify/Modify'
import { Route, Routes } from 'react-router-dom'

export const Community = () => {
    return (
        <div className={styles.container}>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/post/*" element={<Post />} />
                <Route path="/modify/*" element={<Modify postId="1234" />} />
            </Routes>
        </div>
    )
}
