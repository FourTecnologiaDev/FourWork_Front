import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importe o hook useLocation aqui
import DefaultLayout from '../../layout/DefaultLayout';
import { IoMdAdd } from "react-icons/io";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../Authentication/scripts/api';
import { MdDelete } from 'react-icons/md';

interface TableItem {
  _id: number;
  RAT: string;
  codigo: string;
  nomePessoa: string;
  tipoPessoa: string;
  codigoCliente: string;
  nomeCliente: string;
  Data: string;
  desc: string;
  HorasT: number;
  ValorH: number;
  ValorAdc: number;
}


export default function TicketTable({ loggedInEmail }: { loggedInEmail: string }) {
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation(); // Use o hook useLocation dentro do componente


  // Extraia loggedInEmail da localização do state
  const loggedInEmailFromState = location.state?.loggedInEmail;

  // Verifique se loggedInEmail está definido
  useEffect(() => {
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
  }, [loggedInEmailFromState]); // Adicione loggedInEmailFromState ao array de dependências



  useEffect(() => {
    console.log("loggedInEmail:", loggedInEmail);
  
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
  
        let response; // Declare response variable here
  
        if (loggedInEmail && loggedInEmail.endsWith("@fourtc.com.br")) {
          response = await api.get('/gestaoatv', { headers });
        } else {
          response = await api.get('/gestaoatv', { headers }); // Remove const keyword here
          const allData = response.data;
          const filteredData = loggedInEmail && loggedInEmail.endsWith("@fourtc.com.br") ?
            allData :
            allData.filter((item: { Email: string; }) => item.Email === loggedInEmail);
          setTableData(filteredData);
        }
  
        console.log("Dados recebidos da API:", response.data);
  
        // Make sure response is defined before accessing its data
        if (response) {
          setTableData(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
        setError('Erro ao carregar tickets. Por favor, tente novamente mais tarde.');
      }
    };
  
    fetchTickets(); // Call the fetchTickets function
  
  }, [loggedInEmail]); // Add loggedInEmail as a dependency
  



  const handleDeleteTransaction = async (id: number) => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
  
      await api.delete(`/gestaoatv/${id}`, headers); // Chama o endpoint para excluir a transação
  
      // Atualize os dados da tabela após a exclusão bem-sucedida
      
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  const formatarHora = (horas: number) => {
    // Extrair as horas inteiras e os minutos da parte decimal
    const horasInteiras = Math.floor(horas);
    const minutos = Math.round((horas - horasInteiras) * 60);

    // Formatar as horas e minutos com dois dígitos
    const horasFormatadas = String(horasInteiras).padStart(2, '0');
    const minutosFormatados = String(minutos).padStart(2, '0');

    // Retornar a hora formatada no formato 'HH:MM'
    return `${horasFormatadas}:${minutosFormatados}`;
};

  


  
  
  function formatarReal(valor: number | null | undefined | string): string {
    if (valor == null || isNaN(Number(valor))) {
      return ''; // Return an empty string if valor is null, undefined, or not a number
    }
  
    // If valor is not a number, try parsing it
    if (typeof valor !== 'number') {
      valor = parseFloat(valor); // Try parsing the valor as a number
      if (isNaN(valor)) {
        return ''; // Return an empty string if parsing fails
      }
    }
  
    // Format the number as currency string
    return `R$${valor.toFixed(2).replace('.', ',')}`;
  }
  
   

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Gestão de atividades e faturamento" />

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
                  <span className="text-sm font-semibold text-black">Código Pessoa</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Nome</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Tipo Pessoa</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Código Cliente</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Nome Cliente</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Data</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Descrição de Atividades</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Horas Trabalhadas</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Valor Hora</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Valor Adicional</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  <span className="text-sm font-semibold text-black">Valor Total</span>
                </div>
              </th>
              <th className="py-6 px-6 whitespace-nowrap bg-sky-700">
                <div className="flex flex-row items-center justify-center">
                  
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
          {tableData.map((item, index) => {
            const valorTotal = item.ValorH * item.HorasT + item.ValorAdc;

            return (
              <tr key={index} className="bg-zinc-50 text-zinc-800 hover:text-blue-500 text-sm font-light hover:bg-blue-100 border-b border-sky-700">
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.RAT}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.codigo}</span>
                  </div>
                </td>

                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.nomePessoa}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.tipoPessoa}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.codigoCliente}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.nomeCliente}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1 text-black focus:border-blue-500 focus:outline-none">
                      {new Date(item.Data).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{item.desc}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{formatarHora(item.HorasT)}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{formatarReal(item.ValorH)}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{formatarReal(item.ValorAdc)}</span>
                  </div>
                </td>
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">{formatarReal(valorTotal)}</span>
                  </div>
                </td> 
                <td className="cursor-pointer whitespace-nowrap text-center">
                  <div className="py-2">
                    <span className="px-1 py-1">
                      <button onClick={() => handleDeleteTransaction(item._id)} className='text-red-500 font-bold text-[15px] text-center mt-1'>
                        <MdDelete />
                      </button>
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      {isAuthorized && (
        <div className="absolute bottom-4 left-4">
          <Link to="/cadastro2/Apontamento">
            <button type="button" className="flex w-40 font-bold items-center justify-center rounded-md bg-sky-700 py-2 pr-4 text-center font-medium text-white transition hover:bg-slate-700">
              <span className="font-bold">Cadastro</span>
              <IoMdAdd className="ml-1" />
            </button>
          </Link>
        </div>
      )}

      {isAuthorized && (  
      <div className='absolute bottom-4 left-55'>            
          <Link to="/Cadastro/Table">
            <button type="button" className="flex w-40 font-bold items-center justify-center rounded-md bg-sky-700 py-2 pr-4 text-center font-medium text-white transition hover:bg-slate-700">
              <span className="font-bold">Apontamento</span>
              <IoMdAdd className="ml-1" />
            </button>
          </Link>
        </div>
      )}

    </DefaultLayout>
  );
}

function setError(_arg0: string) {
  throw new Error('Function not implemented.');
}

