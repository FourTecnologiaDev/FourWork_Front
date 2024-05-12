import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import api from '../Authentication/scripts/api';
import TicketTable from '../Table/Table';
import { SubmitHandler, FieldValues  } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function Cadastro({ }) {
  const { register, handleSubmit, watch } = useForm();
  const [formData,] = useState("");
  const tipoPessoa = watch("TipoPessoa");
  const [showAlert, setShowAlert] = useState(false)

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
  
      await api.post('/novoUsuario', { email: data.email, password: data.password }, headers);
      await api.post('/cadPessoa', data, headers); 
  
      setShowAlert(true);
  
      setTimeout(() => {
        window.location.href = '/Table/Table';
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };
  
  const handleCEPChange = (event: { target: { value: any; }; }) => {
    let cepInput = event.target.value;
    cepInput = cepInput.replace(/\D/g, '');
    cepInput = cepInput.substring(0, 8);
    if (cepInput.length > 5) {
      cepInput = cepInput.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    event.target.value = cepInput;
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatCPF = (cpf: string) => {
    // Remove tudo que não é número
    cpf = cpf.replace(/\D/g, '');
  
    // Limita o tamanho máximo do CPF para 11 caracteres
    cpf = cpf.substring(0, 11);
  
    // Aplica a formatação do CPF (###.###.###-##)
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  
    return cpf;
  };
  
  const formatCNPJ = (cnpj: string) => {
    // Remove tudo que não é número
    cnpj = cnpj.replace(/\D/g, '');
  
    // Limita o tamanho máximo do CNPJ para 14 caracteres
    cnpj = cnpj.substring(0, 14);
  
    // Aplica a formatação do CNPJ (##.###.###/####-##)
    cnpj = cnpj.replace(/(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/(\d{3})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/(\d{3})(\d)/, '$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
  
    return cnpj;
  };

  const formatTelefone = (telefone: string) => {
    // Remove tudo que não é número
    telefone = telefone.replace(/\D/g, '');
  
    // Limita o tamanho máximo do telefone para 15 caracteres
    telefone = telefone.substring(0, 15);
  
    // Adiciona o prefixo '+' no início do número
    telefone = '+' + telefone;
  
    // Adiciona o espaço entre o DDD e o número de telefone
    if (telefone.length > 3) {
      telefone = telefone.replace(/^(\+\d{2})(\d)/, '$1 $2');
    }
  
    return telefone;
  };

  return (
    <DefaultLayout>
      <div className="flex h-screen max-w-[980px] flex-col py-6 sm:ml-44">
        <div className="mb-4 flex min-w-[980px] flex-row items-center justify-between">
          <h1 className="text-[25px] font-bold text-zinc-700">Cadastro</h1>
          <Link to="/Table/Table">
            <button type="button" className="flex w-36 items-center justify-center rounded-md bg-slate-600 py-2 text-center font-medium text-white transition hover:bg-slate-700">
              Voltar
            </button>
          </Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-8  rounded-lg ">         
         <div className="mb-4 flex flex-row flex-wrap mt-4">
           {tipoPessoa === "Cliente" && (
              <div className="flex w-[380px] flex-col md:pr-4">
                <label htmlFor="nomePessoa" className="block font-semibold text-zinc-700">Nome Cliente</label>
                <input type="text" {...register('nomeCliente')} id="nomePessoa" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
              </div>
               )}
            {tipoPessoa !== "Cliente" && (
              <div className="flex w-[380px] flex-col md:pr-4">
                <label htmlFor="nomePessoa" className="block font-semibold text-zinc-700">Nome</label>
                <input type="text" {...register('nomePessoa')} id="nomePessoa" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
              </div>
            )}
            <div className="flex w-[250px] flex-col md:pr-4">
              <label htmlFor="email" className="block font-semibold text-zinc-700">E-mail</label>
              <input type="text" {...register('email')} id="email" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[250px] flex-col md:pr-4">
              <label htmlFor="senha" className="block font-semibold text-zinc-700">Senha</label>
              <input type="text" {...register('password')} id="senha" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="flex flex-row flex-wrap">
            <div className="flex w-[200px] flex-col md:pr-4 mr-5 ">
              <label htmlFor="cnpj" className="block font-semibold text-zinc-700 ">CNPJ</label>
              <input placeholder="99.999.999/9999-99" type="text" {...register('CNPJ', { onChange: (e) => e.target.value = formatCNPJ(e.target.value) })} id="CNPJ" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[200px] flex-col md:pr-4">
              <label htmlFor="cpf" className="block font-semibold text-zinc-700">CPF</label>
              <input placeholder="999.999.999-99" type="text" {...register('CPF', { onChange: (e) => e.target.value = formatCPF(e.target.value) })} id="CPF" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
          
            <div className="flex w-[300px] flex-col md:pr-4">
              <label htmlFor="tipoPessoa" className="block font-semibold text-zinc-700">Tipo Pessoa</label>
              <select id="tipoPessoa" {...register('TipoPessoa')} className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none">
                <option value="">Selecione o tipo de pessoa</option>
                <option value="Colaborador">Colaborador</option>
                <option value="Terceiro">Fornecedor</option>
                <option value="Estagiario">Estagiário</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
            {tipoPessoa !== "Cliente" && (
              <div className="flex w-[100px] flex-col md:pr-1">
                <label htmlFor="codigo" className="block font-semibold text-zinc-700">Código</label>
                <input type="text" placeholder="000" id="codigo" {...register('codigo')} className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
              </div>
            )}
            {tipoPessoa === "Cliente" && (
              <div className="flex w-[100px] flex-col md:pr-1">
                <label htmlFor="codigoCliente" className="block font-semibold text-zinc-700">Cod Cliente</label>
                <input type="text" placeholder="000" id="codigoCliente" {...register('codigoCliente')} className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
              </div>
            )}
          
          </div>

          <div className="mb-4 flex flex-row flex-wrap mt-4">
            <div className="flex w-[160px] flex-col md:pr-4">
              <label htmlFor="cep" className="block font-semibold text-zinc-700">CEP</label>
              <input placeholder="99999-999" type="text" {...register('cep')} id="cep" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" onChange={handleCEPChange} />
            </div>
            <div className="flex w-[380px] flex-col md:pr-4">
              <label htmlFor="endereco" className="block font-semibold text-zinc-700">Endereço</label>
              <input type="text" {...register('Endereço')} id="Endereço" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[100px] flex-col md:pr-4">
              <label htmlFor="numero" className="block font-semibold text-zinc-700">Número</label>
              <input type="number" {...register('Numero')} id="Número" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[200px] flex-col md:pr-4">
              <label htmlFor="telefone" className="block font-semibold text-zinc-700">Telefone</label>
              <input
                placeholder="+99 (99) 99999-9999"
                type="text"
                {...register('telefone', { onChange: (e) => e.target.value = formatTelefone(e.target.value) })}
                id="telefone"
                className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-row flex-wrap mt-4">
            <div className="flex w-[160px] flex-col md:pr-4">
              <label htmlFor="valor" className="block font-semibold text-zinc-700">Valor Hora</label>
              <input type="text" defaultValue="0.00" {...register('ValorH', { valueAsNumber: true })} id="ValorH" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" onBlur={(e) => e.target.value = formatCurrency(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex justify-end">
              <button type="submit" className="mt-30 flex w-30 font-bold items-center justify-center rounded-md bg-sky-700 py-2 pr-4 text-center font-medium text-white transition hover:bg-slate-700">
                <span className=" font-bold">Enviar</span>
              </button>
          </div>

        </form>
      </div>

        {showAlert && (
          <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center">
            <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-4">
              <p className="text-xl font-semibold text-green-500">Usuário cadastrado com sucesso! 🍀</p>
            </div>
          </div>
        )}

        <TicketTable loggedInEmail={formData} />
    </DefaultLayout>
  );
}
