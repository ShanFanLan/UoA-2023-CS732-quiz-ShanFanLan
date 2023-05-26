import styles from './PokemonTable.module.css';

export default function PokemonTable({pokemon}) {
    return (
        <div className={styles.Ing}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Species Name</th>
                    <th>Species Description</th>
                </tr>
                </thead>
                <tbody>
                {(pokemon).map((item, index) => (
                    <tr key={index}>
                        <td>{item.species.name}</td>
                        <td>{item.species.dexEntry}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}