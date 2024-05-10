import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importe o hook useLocation aqui
import DefaultLayout from '../../layout/DefaultLayout';
import { IoMdAdd } from "react-icons/io";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../Authentication/scripts/api';
import { MdDelete } from 'react-icons/md';


export default function TicketTable({ loggedInEmail }) {
  const [tableData, setTableData] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation(); // Use o hook useLocation dentro do componente
  const [formData, setFormData] = useState(null);

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
  console.log("loggedInEmail:", loggedInEmail); // Adicione este log para verificar o valor de loggedInEmail

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return; // Se não houver token, não faça a chamada da API
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Buscar todos os dados da rota /gestaoatv
      let response;
      if (loggedInEmail && loggedInEmail.endsWith("@fourtc.com.br")) {
        // Se o e-mail termina com "@fourtc.com.br",
        // buscar todos os dados sem filtrar por e-mail
        response = await api.get('/gestaoatv', { headers });
      } else {
        // Caso contrário, filtrar os dados com base no e-mail logado
        // Obter os dados da API
        const response = await api.get('/gestaoatv', { headers });

        // Extrair os dados da resposta
        const allData = response.data;

        // Filtrar os dados com base no e-mail logado
        const filteredData = loggedInEmail && loggedInEmail.endsWith("@fourtc.com.br") ?
          allData :
          allData.filter(item => item.Email === loggedInEmail);

        // Utilize diretamente os dados filtrados
        setTableData(filteredData);
      }

      console.log("Dados recebidos da API:", response.data); // Adicione este log para verificar os dados recebidos da API

      setTableData(response.data); // Definindo os dados filtrados na tableData
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
      setError('Erro ao carregar tickets. Por favor, tente novamente mais tarde.');
    }
  };

  fetchTickets();
}, [loggedInEmail]);
  
  const Novo = () => {
    window.location.href = '/cadastro/Table';
  };
  
  const Apontamento = () => {
    window.location.href = '/cadastro2/Apontamento';
  };


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

  const formatarHora = (horas) => {
    // Verifica se a entrada é válida
    if (!horas || typeof horas !== 'string') {
        return horas;
    }

    // Separa as horas e os minutos
    const [hours, minutes] = horas.split(":");

    // Verifica se há apenas uma hora e não há minutos
    if (hours && !minutes && hours.length === 1) {
        // Adiciona os minutos ":00" à hora
        return `${hours}:00`;
    }

    // Verifica se as horas e os minutos foram corretamente separados
    if (!hours || !minutes) {
        return horas; // Retorna o valor de entrada se a separação não produzir as partes esperadas
    }

    // Retorna as horas formatadas com zero à esquerda para garantir dois dígitos
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};


  
  
  function formatarReal(valor) {
    if (valor == null || isNaN(valor)) {
      return ''; // Return an empty string if valor is null, undefined, or not a number
    }
    if (typeof valor !== 'number') {
      valor = parseFloat(valor); // Try parsing the valor as a number
      if (isNaN(valor)) {
        return ''; // Return an empty string if parsing fails
      }
    }
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
          <button type="button" onClick={Novo} className="flex w-40 font-bold items-center justify-center rounded-md bg-sky-700 py-2 pr-4 text-center font-medium text-white transition hover:bg-slate-700">
            <span className="font-bold justify-center">Apontamento </span>
            <IoMdAdd className="ml-1  " />
          </button>
        </div>
      )}  
      {isAuthorized && (  
      <div className='absolute bottom-4 left-55'>            
        <button type="button" onClick={Apontamento} className="flex w-40 font-bold items-center justify-center rounded-md bg-sky-700 py-2 pr-4 text-center font-medium text-white transition hover:bg-slate-700">
          <span className="font-bold justify-center">Cadastrar</span>
            <IoMdAdd className="ml-1  " />
          </button>
        </div>
      )}

    </DefaultLayout>
  );
}
