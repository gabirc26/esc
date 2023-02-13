import { useState } from 'react'
import { Link } from 'react-router-dom'
function List(props) {
    const { search, status, render, link } = props
    const [renderization, setRenderization] = useState(status)

    const state = {
        loading: "loading",
        search: "seach",
        data: "data",
        error: "error"
    }
    const teste = () => {
        if (renderization === state.loading) {
            return (
                <p className="mt-5 text-center">Carregando informações...</p>
            )
        }
        if (renderization === "data") {
            return (
                <p>foi</p>
                // <div>
                //     {render ? (
                //         <div>
                //             {render.map(info => (
                //                 <div className="border m-3 px-2 d-flex justify-content-between" key={info.id}>
                //                     <p className="m-2">{info.nome}</p>
                //                     <Link to={`/${selectedOption}/${info.id}`}> <button className="btn btn-light px-3 my-2">info</button></Link>
                //                 </div>
                //             ))}
                //         </div>
                //     ): (
                //         <p></p>
                //     )}
                // </div>
            )
        }
    }
    




    return (
        <>
            <div>

            </div>
        </>
    )
}

export default List




// {searchRender ? (
//     <div>
//         {searchRender.map(info => (
//             <div className="border m-3 px-2 d-flex justify-content-between" key={info.id}>
//                 <p className="m-2">{info.nome}</p>
//                 <Link to={`/${selectedOption}/${info.id}`}> <button className="btn btn-light px-3 my-2">info</button></Link>
//             </div>
//         ))}
//     </div>
// ) : (
//     {data ? (
//             <div>
//     {data.map(info => (
//             <div className="border m-3 px-2 d-flex justify-content-between" key={info.id}>
//                 <p className="m-2">{info.nome}</p>
//                 <Link to={`/${selectedOption}/${info.id}`}> <button className="btn btn-light px-3 my-2">info</button></Link>
//             </div>
//         ))
//     }
// ) : (
// <p className="mt-5 text-center">Carregando informações...</p>
// )
// )}





                    {/* <List status={status} render={render} link={selectedOption}/> */}
