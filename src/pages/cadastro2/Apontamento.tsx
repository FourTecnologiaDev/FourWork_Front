import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import api from '../Authentication/scripts/api';
import TicketTable from '../Table/Table';

export default function Apontamento({ loggedInEmail }) {
  const { register, handleSubmit, setValue } = useForm();
  const [formData, setFormData] = useState({
    codigo: '',
    codigoCliente: '',
    RAT: '',
    nomePessoa: '',
    Email: '',
    ValorH: 0,
    HorasT: 0,
    ValorAdc: 0,
    Data: '',
    desc: ''
  });
  const [tipoPessoaSelecionado, setTipoPessoaSelecionado] = useState('');
  const [usuariosPorTipo, setUsuariosPorTipo] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [ultimoCodigoRAT, setUltimoCodigoRAT] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const codigoRAT = await gerarProximoCodigoRAT();
        setUltimoCodigoRAT(codigoRAT);
        setValue('RAT', codigoRAT);
      } catch (error) {
        console.error('Erro ao gerar código RAT:', error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
  
      // Verificar se o código RAT já existe
      const resposta = await api.get(`/gestaoatv/${data.RAT}`, headers);
      if (resposta.data.existe) {
        // Se o código RAT existe, exibir um alerta ou mensagem indicando que o código já existe
        alert('O código RAT já existe. Por favor, escolha outro.');
      } else {
        // Se o código RAT não existe, enviar o formulário
        data.codigo = formData.codigo; 
        data.ValorH = formData.ValorH;
        data.nomePessoa = formData.nomePessoa;
        data.Email = formData.Email;
        data.tipoPessoa = tipoPessoaSelecionado;
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
    
        await api.post('/gestaoatv', data, headers);
  
        // Atualizar o próximo código RAT no formulário após enviar os dados com sucesso
        mostrarProximoCodigoRAT();
        
        // Redirecionar para a página Table/Table após o envio bem-sucedido
        window.location.href = '/Table/Table';
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  useEffect(() => {
    const verificarExistenciaCodigoRAT = async () => {
      try {
        if (formData.RAT) {

          const headers = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          };
  
          const resposta = await api.get(`/gestaoatv/${formData.RAT}`, headers);
          if (resposta.data && resposta.data.length > 0) {
            // Código RAT já existe, incrementar último dígito
            setUltimoCodigoRAT(resposta.data[0].RAT);
          }
        }
      } catch (erro) {
        console.error('Erro ao verificar existência do código RAT:', erro);
      }
    };
  
    verificarExistenciaCodigoRAT();
  }, [formData.RAT]);

  const gerarProximoCodigoRAT = async () => {
    try {
      let novoCodigoRAT;
      let ultimoNumero = 0;
  
      // Verificar se há um último código RAT definido
      if (ultimoCodigoRAT) {
        ultimoNumero = parseInt(ultimoCodigoRAT.substring(1)) || 0;
      }
  
      let codigoExistente = true;
      while (codigoExistente) {
        // Incrementar o último número
        ultimoNumero++;
        novoCodigoRAT = `F${ultimoNumero.toString().padStart(7, '0')}`;
        
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        // Verificar se o novo código RAT já existe na API
        const resposta = await api.get(`/gestaoatv/${novoCodigoRAT}`, headers);
        codigoExistente = resposta.data.existe;
      }
  
      return novoCodigoRAT;
    } catch (error) {
      console.error('Erro ao gerar próximo código RAT:', error);
      throw error;
    }
  };
  

// Função para exibir o próximo código RAT disponível no formulário
const mostrarProximoCodigoRAT = async () => {
  try {
    // Verificar o próximo código RAT disponível
    const codigoRAT = await gerarProximoCodigoRAT() || '';

    // Atualizar o estado do formulário com o próximo código RAT
    setFormData(prevState => ({
      ...prevState,
      RAT: codigoRAT
    }));
  } catch (error) {
    console.error('Erro ao mostrar próximo código RAT:', error);
  }
};


  useEffect(() => {
    mostrarProximoCodigoRAT();
  }, []);

  const handleUsuarioChange = (nome) => {
    const selectedUser = usuariosPorTipo.find(user => user.nomePessoa === nome);
    if (selectedUser) {
      console.log("Dados do usuário selecionado:", selectedUser);
      setFormData({
        ...formData,
        nomePessoa: selectedUser.nomePessoa,
        codigo: selectedUser.codigo,
        ValorH: selectedUser.ValorH,
        Email: selectedUser.Email
      });
    }
  };
  
  const handleClienteChange = (name) => {
    const selectedCliente = clientes.find(cliente => cliente.nomeCliente === name);
    if (selectedCliente) {
      console.log("Dados do cliente selecionado:", selectedCliente);
      setClienteSelecionado(selectedCliente.codigoCliente); // Atualiza o cliente selecionado
      setValue('codigoCliente', selectedCliente.codigoCliente); // Define o código do cliente no input
      setValue('nomeCliente', selectedCliente.nomeCliente); // Define o nome do cliente no input
      setFormData({
        ...formData,
        codigoCliente: selectedCliente.codigoCliente, // Atualiza o código do cliente no state formData
        nomeCliente: selectedCliente.nomeCliente // Atualiza o nome do cliente no state formData
      });
    }
  };
  
  useEffect(() => {
    const buscarUsuariosPorTipo = async (tipo) => {
      try {
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const resposta = await api.get(`/cadPessoa/${tipo}`, headers);
        setUsuariosPorTipo(resposta.data);
      } catch (erro) {
        console.error('Erro ao buscar usuários por tipo:', erro);
      }
    };

    buscarUsuariosPorTipo(tipoPessoaSelecionado);
  }, [tipoPessoaSelecionado]);

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const resposta = await api.get('/cadPessoa/Cliente', headers);
        setClientes(resposta.data);
        if (resposta.data.length > 0) {
          // Define o primeiro cliente como padrão
          setClienteSelecionado(resposta.data[0].codigoCliente);
        }
      } catch (erro) {
        console.error('Erro ao buscar clientes:', erro);
      }
    };

    buscarClientes();
  }, []);

  const formatCurrency = (value) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatHours = (hours) => {
    const formattedHours = `${hours < 10 ? '0' : ''}${Math.floor(hours)}:${Math.round((hours % 1) * 60) < 10 ? '0' : ''}${Math.round((hours % 1) * 60)}`;
    return formattedHours;
  };

  useEffect(() => {
    if (ultimoCodigoRAT) {
      setValue('RAT', ultimoCodigoRAT);
    }
  }, [ultimoCodigoRAT, setValue]);

  return (
    <DefaultLayout>
      <div className="flex h-screen max-w-[980px] flex-col py-6 sm:ml-44">
        <div className="mb-4 flex min-w-[980px] flex-row items-center justify-between">
          <h1 className="text-[25px] font-bold text-zinc-700">Apontamento</h1>
          <button type="button" className="flex w-36 items-center justify-center rounded-md bg-slate-600 py-2 text-center font-medium text-white transition hover:bg-slate-700">
            Voltar
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-8  rounded-lg ">
          <div className="flex flex-row flex-wrap">
            <div className="flex w-[150px] flex-col md:pr-1">
              <label htmlFor="codigo" className="block font-semibold text-zinc-700">Código Pessoa</label>
              <input type="text" value={formData ? formData.codigo : ''} id="codigo" {...register('codigo')} className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[200px] flex-col md:pr-4 ml-4">
              <label htmlFor="cliente" className="block font-semibold text-zinc-700">Código Cliente</label>
              <input type="number" {...register('codigoCliente')} id="cliente" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[200px] flex-col md:pr-4">
              <label htmlFor="cnpj" className="block font-semibold text-zinc-700">Código RAT</label>
              <input
                readOnly
                type="text"
                value={ultimoCodigoRAT || ""}
                id="RAT"
                {...register('RAT')}
                className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none"
                onBlur={(e) => {
                  e.target.value = ultimoCodigoRAT || "";
                }}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-row flex-wrap mt-4">
            <div className="flex w-[380px] flex-col md:pr-4">
              <label htmlFor="nomePessoa" className="block font-semibold text-zinc-700">Nome</label>
              <input
                type="text"
                readOnly
                value={formData ? formData.nomePessoa : ''}
                id="nomePessoa"
                className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none"
                {...register('nomePessoa')}
              />
            </div>
            <div className="flex w-[380px] flex-col md:pr-4">
              <label htmlFor="nomePessoa" className="block font-semibold text-zinc-700">E-mail</label>
              <input
                type="text"
                readOnly
                value={formData ? formData.Email : ''}
                id="email"
                className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none"
                {...register('Email')}
              />
            </div>
            <div className="flex w-[300px] flex-col md:pr-4 mt-4">
              <label htmlFor="tipoPessoa" className="block font-semibold text-zinc-700">Tipo Pessoa</label>
              <select
                className='rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none'
                value={tipoPessoaSelecionado}
                {...register('tipoPessoa')}
                onChange={(e) => {
                  setTipoPessoaSelecionado(e.target.value);
                }}              
              >
                <option value="">Selecione o tipo de pessoa</option>
                <option value="Colaborador">Colaborador</option>
                <option value="Fornecedor">Fornecedor</option>
                <option value="Estagiario">Estagiário</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
            {tipoPessoaSelecionado && ( 
              <div className="flex w-[300px] flex-col md:pr-4 mt-4">
                <label htmlFor="usuario" className="block font-semibold text-zinc-700">{tipoPessoaSelecionado}</label>
                <select
                  {...register('tipoPessoa')}
                  id="usuario"
                  className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none"
                  onChange={(e) => handleUsuarioChange(e.target.value)}
                >
                  <option value="">Selecione o {tipoPessoaSelecionado}</option>
                  {usuariosPorTipo.map((usuario, index) => (
                    <option key={index} value={usuario.nomePessoa}>{usuario.nomePessoa}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Select para escolher o cliente */}
            <div className="flex w-[380px] flex-col md:pr-4 mt-4">
                <label htmlFor="nomeCliente" className="block font-semibold text-zinc-700">Nome Cliente</label>
                <input type="text" {...register('nomeCliente')} id="nomeCliente" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[300px] flex-col md:pr-4 mt-4">
              <label htmlFor="cliente" className="block font-semibold text-zinc-700">Cliente</label>
              <select
                {...register('cliente')}
                id="cliente"
                className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none"
                onChange={(e) => handleClienteChange(e.target.value)}
                value={clienteSelecionado}
              >
                <option value="">Selecione o cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente.nomeCliente}>{cliente.nomeCliente}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="mb-4 flex flex-row flex-wrap mt-4">
            <div className="flex w-[160px] flex-col md:pr-4">
              <label htmlFor="valor" className="block font-semibold text-zinc-700">Valor Hora</label>
              <input
                type="text"
                value={formData ? formData.ValorH : "0.00"}
                readOnly
                {...register('ValorH', { valueAsNumber: true })}
                id="ValorH"
                className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none"
                onBlur={(e) => e.target.value = formatCurrency(parseFloat(e.target.value))}
                onFocus={(e) => e.target.value = parseFloat(e.target.value.replace('R$ ', '')).toFixed(2)}
              />
            </div>
            <div className="flex w-[200px] flex-col md:pr-4">
              <label htmlFor="horas" className="block font-semibold text-zinc-700">Horas Trabalhadas</label>
              <input type="text" defaultValue="00:00" {...register('HorasT', { valueAsNumber: true })} id="HorasT" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" onBlur={(e) => e.target.value = formatHours(parseFloat(e.target.value))} />
            </div>
            <div className="flex w-[200px] flex-col md:pr-4">
              <label htmlFor="adicional" className="block font-semibold text-zinc-700">Valor Adicional</label>
              <input type="text" defaultValue="R$ 0.00" {...register('ValorAdc', { valueAsNumber: true })} id="ValorAdc" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" onBlur={(e) => e.target.value = formatCurrency(parseFloat(e.target.value))} />
            </div>
            <div className="flex w-[175px] flex-col md:pr-4">
              <label htmlFor="data" className="block font-semibold text-zinc-700">Data de Lançamento</label>
              <input type="date" {...register('Data')} id="Data" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex w-[200px] flex-col md:pr-4">
            <label htmlFor="desc" className="block font-semibold text-zinc-700">Descrição Atividades</label>
            <textarea className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" {...register('desc')}></textarea>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="mt-30 flex w-30 font-bold items-center justify-center rounded-md bg-sky-700 py-2 pr-4 text-center font-medium text-white transition hover:bg-slate-700">
              <span className="font-bold">Enviar</span>
            </button>
          </div>

        </form>
      </div>
      {formData && <TicketTable formData={formData} />}
    </DefaultLayout>
  );
}
