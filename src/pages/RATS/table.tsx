import { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { IoMdAdd } from "react-icons/io";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../Authentication/scripts/api';
import { useLocation } from 'react-router-dom'; 

interface TableData {
  _id: string;
  ratcod: string;
  Ratsenior: string;
  seniorcod: string;
  Stats: string;
  Data: string;
  // Add other properties as needed
}

function RatTable() {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [, setError] = useState<string | null>(null); 
  const [, setIsAuthorized] = useState<boolean>(false); 
  const location = useLocation(); 

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return; 
        }
  
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
  
        const response = await api.get('/rats', { headers });
        setTableData(response.data); 
      } catch (error) {
        console.error('Error loading tickets:', error);
        setError('Error loading tickets. Please try again later.'); 
      }
    };
  
    fetchTickets();
  }, []);

  useEffect(() => {
    const loggedInEmailFromState = location.state?.loggedInEmail;

    if (!loggedInEmailFromState) {
      console.log('Usuário autorizado: loggedInEmail não definido');
      return;
    }

    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthorized(false);
          return;
        }
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const body = { email: localStorage.getItem("userEmail") }
        const response = await api.post('/authorizedUsers', body, headers);

        setIsAuthorized(response.data.isAuth);
      } catch (error) {
        console.error('Erro ao verificar autorização:', error);
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [location.state?.loggedInEmail]); 

  const Novo = () => {
    window.location.href = '/RAT/Table'; 
  };

  async function pdfDowload(_id: string) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const responsePDF = await api.post("/ratsdowloadpdf", { _id: _id }, {
        ...headers,
        responseType: "blob",
      });

      if (responsePDF.data) {
        const blob = new Blob([responsePDF.data], {
          type: "application/pdf",
        });
      
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
      
        link.download = `Teste.pdf`;
      
        link.click();
      
        window.URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error('Erro ao carregar RAT:', error);
    }
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Gestão de RATS" />
      <div className="mt-20 relative w-full overflow-x-auto overscroll-y-auto border-1 shadow-md sm:rounded-xl" style={{ maxHeight: 'calc(-100px + 100vh)' }}>
        <table className="w-full py-5 text-xs">
          <thead className="sticky top-0 bg-sky-700 text-xs">
            <tr>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Código RAT</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">RAT Senior</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Código RAT Senior</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Anexo</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Status</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Data de Pagamento</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => (
              <tr key={item._id} className="bg-zinc-50 text-zinc-800 hover:text-blue-500 text-sm font-light hover:bg-blue-100 border-b border-sky-700">
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.ratcod}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.Ratsenior}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.seniorcod}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2" onClick={() => pdfDowload(item._id)}>
                    Baixar
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    {item.Stats}
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    {item.Data}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="absolute bottom-4 left-4">
        <button type="button" onClick={Novo} className="flex w-30 font-bold items-center justify-center rounded-md bg-sky-700 py-2 pr-4 text-center font-medium text-white transition hover:bg-slate-700">
          <span className="font-bold justify-center">Novo </span>
          <IoMdAdd className="ml-1" />
        </button>
      </div>
    </DefaultLayout>
  );
}

export default RatTable;