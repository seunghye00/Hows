import styles from './Main.module.css'

export const Main = () => {
    return (
        <div className={styles.dashboardContainer}>
            {/* Header */}
            <header className={styles.header}>
                <h1>How's DashBoard</h1>
            </header>

            {/* Top boxes */}
            <div className={styles.topBoxes}>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
            </div>

            {/* Subtitle section */}
            <div className={styles.subtitleSection}>
                <h2 className={styles.subtitle}>A Subtitle</h2>
                <table className={styles.table}>
                    <tbody>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Pie chart and bar/line charts */}
            <div className={styles.chartSection}>
                <div className={styles.pieChart}></div>
                <div className={styles.barAndLineCharts}>
                    <div className={styles.barChart}></div>
                    <div className={styles.lineChart}></div>
                </div>
            </div>
        </div>
    )
}
