import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import api from '../Authentication/scripts/api';
import RatTable from '../RATS/table';

export default function Cadastro() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [formData, setFormData] = useState(null);
  const [showCodigoRAT, setShowCodigoRAT] = useState(false);
  const [ratSelecionado, setRATSelecionado] = useState('');
  const [rats, setRats] = useState([]);

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

  const onSubmit = async (data) => {
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

    } catch (error) {
      console.error('Erro ao cadastrar RAT:', error);
    }
  };
  
  const Voltar = () => {
    window.location.href = '/RATS/Table';
  };

  const handleRATChange = (codigo) => {
    const selectedRAT = rats.find(rat => rat.RAT === codigo);
    if (selectedRAT) {
      console.log("Dados do RAT selecionado:", selectedRAT);
      setRATSelecionado(selectedRAT.RAT);
      setValue('Ratcod', selectedRAT.RAT);
      setFormData({
        Ratcod: selectedRAT.RAT,
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
                <label htmlFor="RAT" className="block font-semibold text-zinc-700">RATS</label>
                <select
                  {...register('RAT')}
                  id="RAT"
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
              <label htmlFor="ratS" className="block font-semibold text-zinc-700">RAT Senior</label>
              <select {...register('Ratsenior')} id="ratS" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" onChange={(e) => setShowCodigoRAT(e.target.value === 'sim')}>
                <option value="">Sim / Não</option>
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>
            </div>
            {showCodigoRAT && (
              <div className="flex w-[300px] flex-col md:pr-4">
                <label htmlFor="seniorcod" className="block font-semibold text-zinc-700">Código RAT Senior</label>
                <input placeholder="" type="number" {...register('Seniorcod')} id="seniorcod" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
                {errors.seniorcod && <span className="text-red-500">Este campo é obrigatório</span>}
              </div>
            )}
          </div>
          <div className="mb-4 flex flex-row flex-wrap">
            <div className="flex w-[380px] flex-col md:pr-4">
              <label htmlFor="anexo" className="block font-semibold text-zinc-700">Anexo RAT Senior</label>
              <input type="file" {...register('Anexo')} id="anexo" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
              {errors.Anexo && <span className="text-red-500">Este campo é obrigatório</span>}
            </div>            
            <div className="flex w-[200px] flex-col md:pr-4">
              <label htmlFor="data" className="block font-semibold text-zinc-700">Data de Lançamento</label>
              <input type="date" {...register('Data')} id="Data" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex w-[300px] flex-col md:pr-4">
              <label htmlFor="status" className="block font-semibold text-zinc-700">Status</label>
              <select {...register('Stats')} id="stats" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none">
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
      {formData && <RatTable formData={formData} />}
    </DefaultLayout>
  );
}

