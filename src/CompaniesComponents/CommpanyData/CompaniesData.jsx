import  { useEffect, useState } from 'react'
import CompanyNames from '../CompanyNames/CompanyNames';
import Loader from "../Loader/Loader"
import "./CompanyData.css"


const api = "https://fakerapi.it/api/v1/companies?_quantity=10";
const CompaniesData = () => {
        const [companiesData, setCompaniesData] = useState([])
        const [error,setError] = useState("");
        const [loading, setLoading] = useState(false)  

    

    useEffect(()=>{
        const renderCompanies = async ()=>{
        try{
            setLoading(true)
            const response = await fetch(api);
            
            if(response.ok){
                const data = await response.json()
                console.log(data)
                setCompaniesData(data.data)
            }else{
                setError("Failed to fetch data");
            }
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
        
    }
        renderCompanies()
    },[])


  return (

    <div>
      {loading && <Loader/>}
      {error && <p className='failedFetch'>{error}</p>}
      {!loading && !error && (
        <CompanyNames CompaniesData ={companiesData}/>
      )}
    </div>
  )
}

export default CompaniesData
