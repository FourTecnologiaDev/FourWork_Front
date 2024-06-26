'use client'

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import api from '../Authentication/scripts/api';
import { useNavigate } from 'react-router-dom';

interface FormData {
  Ratcod: string | Blob;
  Ratsenior: string | Blob;
  RatcodS: string | Blob;
  Anexo: (string | Blob)[];
  Stats: string | Blob;
  Data: string | Blob;
}



export default function Cadastro() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const [, setFormData] = useState<FormData | null>(null);
  const [showCodigoRAT, setShowCodigoRAT] = useState(false);
  const [ratSelecionado, setRATSelecionado] = useState('');
  const [rats, setRats] = useState<any[]>([]);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await api.get('/gestaoatv', headers);
        setRats(response.data);
      } catch (error) {
        console.error('Erro ao buscar os RATs:', error);
      }
    }

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('Ratcod', data.Ratcod);
      formData.append('Ratsenior', data.Ratsenior);
      formData.append('RatcodS', data.RatcodS);
      formData.append('Anexo', data.Anexo[0]);
      formData.append('Stats', data.Stats);
      formData.append('Data', data.Data);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await api.post('/rats', formData, { headers });
      console.log('Resposta da API:', response.data);
  
      if (response.status === 200) {
        console.log('RAT cadastrado com sucesso!');
        window.location.href='/RATS/Table'
      } else {
        console.error('Erro ao cadastrar RAT:', response.statusText);
      }

      setShowAlert(true);
  
      setTimeout(() => {
        navigate('/Table/Table');
      }, 2000);
    } catch (error) {
      console.error('Erro ao cadastrar RAT:', error);
    }
  };
  
  const Voltar = () => {
    navigate('/Table/Table');
  };

  const handleRATChange = (codigo: string) => {
    const selectedRAT = rats.find(rat => rat.RAT === codigo);
    if (selectedRAT) {
      console.log("Dados do RAT selecionado:", selectedRAT);
      setRATSelecionado(selectedRAT.RAT);
      setValue('Ratcod', selectedRAT.RAT);
      setFormData({
        Ratcod: selectedRAT.RAT,
        Ratsenior: '', 
        RatcodS: '',
        Anexo: [],
        Stats: '',
        Data: '',
      });
    }
  };

  return (
    <DefaultLayout>
      <div className="flex h-screen max-w-[980px] flex-col py-6 sm:ml-44">
        <div className="mb-4 flex min-w-[980px] flex-row items-center justify-between">
          <h1 className="text-[25px] font-bold text-zinc-700">Cadastro</h1>      
            <button 
              type="button" 
              className="flex w-36 items-center justify-center rounded-md bg-slate-600 py-2 text-center font-medium text-white transition hover:bg-slate-700"
              onClick={Voltar}
            > 
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-1 text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
              </svg>
              Voltar
            </button>


        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-8 rounded-lg ">
          <div className="mb-4 flex flex-row flex-wrap">
            <div className="flex w-[200px] flex-col md:pr-4">
              <div className="flex w-[200px] flex-col md:pr-4 ">
                <label htmlFor="Ratcod" className="block font-semibold text-zinc-700">RATS</label>
                <select
                  {...register('Ratcod')}
                  id="Ratcod"
                  className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none"
                  onChange={(e) => handleRATChange(e.target.value)}
                  value={ratSelecionado}
                >
                  <option value="">Selecione o RAT</option>
                  {rats.map((rat) => (
                    <option key={rat._id} value={rat.RAT}>{rat.RAT}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex w-[300px] flex-col md:pr-4">
              <label htmlFor="Ratsenior" className="block font-semibold text-zinc-700">RAT Senior</label>
              <select {...register('Ratsenior')} id="Ratsenior" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" onChange={(e) => setShowCodigoRAT(e.target.value === 'sim')}>
                <option value="">Sim / Não</option>
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>
            </div>
            {showCodigoRAT && (
              <div className="flex w-[300px] flex-col md:pr-4">
                <label htmlFor="RatcodS" className="block font-semibold text-zinc-700">Código RAT Senior</label>
                <input placeholder="" type="number" {...register('RatcodS')} id="RatcodS" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
                {errors.RatcodS && <span className="text-red-500">Este campo é obrigatório</span>}
              </div>
            )}
          </div>
          <div className="mb-4 flex flex-row flex-wrap">
            <div className="flex w-[380px] flex-col md:pr-4">
              <label htmlFor="Anexo" className="block font-semibold text-zinc-700">Anexo RAT Senior</label>
              <input type="file" {...register('Anexo')} id="Anexo" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
              {errors.Anexo && <span className="text-red-500">Este campo é obrigatório</span>}
            </div>            
            <div className="flex w-[200px] flex-col md:pr-4">
              <label htmlFor="Data" className="block font-semibold text-zinc-700">Data de Lançamento</label>
              <input type="date" {...register('Data')} id="Data" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[300px] flex-col md:pr-4">
              <label htmlFor="Stats" className="block font-semibold text-zinc-700">Status</label>
              <select {...register('Stats')} id="Stats" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none">
                <option value="">Selecione o Status</option>
                <option value="Aberta">Aberta</option>
                <option value="Em aprovação">Em aprovação</option>
                <option value="Aprovada">Aprovada</option>
                <option value="Integrada">Integrada</option>
                <option value="Aguardando NF">Aguardando NF</option>
                <option value="Pagamento Programado">Pagamento Programado</option>
                <option value="Pagamento Efetuado">Pagamento Efetuado</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">          
              <button type="submit" className="mt-60 flex w-30 font-bold items-center justify-center rounded-md bg-sky-700 py-2 pr-4 text-center font-medium text-white transition hover:bg-slate-700">
                <span className="font-bold">Enviar</span>
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
    </DefaultLayout>
  );
}
