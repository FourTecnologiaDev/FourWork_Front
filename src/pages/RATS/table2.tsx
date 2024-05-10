import { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import api from '../Authentication/scripts/api';
import RatTable from '../RATS/table';

export default function VisualizarRat() {
  
  const [formData] = useState({
    codigoRAT: '',
    Ratsenior: '',
    codigoRATS: '',
    Anexo: '',
    Data: '',
    Stats: ''
  });

  useEffect(() => {
    const fetchRatData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const responsePDF = await api.get("/rats", {
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
    };

    fetchRatData();
  }, []);

  async function pdfDowload() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const responsePDF = await api.get("/rats", {
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
      <div className="flex h-screen max-w-[980px] flex-col py-6 sm:ml-44">
        <div className="mb-4 flex min-w-[980px] flex-row items-center justify-between">
          <h1 className="text-[25px] font-bold text-zinc-700">Cadastro</h1>
          <button 
            type="button" 
            className="flex w-36 items-center justify-center rounded-md bg-slate-600 py-2 text-center font-medium text-white transition hover:bg-slate-700"
            onClick={() => window.location.href='/RATS/Table'}
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-1 text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
            </svg>
            Voltar
          </button>
        </div>
        {formData && (
          <form className="mx-auto p-8 rounded-lg ">
            <div className="mb-4 flex flex-row flex-wrap">
              <div className="flex w-[200px] flex-col md:pr-4">
                <label htmlFor="codigoRAT" className="block font-semibold text-zinc-700">Código RAT</label>
                <input type="text" value={formData.codigoRAT} id="codigoRAT" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" readOnly />
              </div>
              <div className="flex w-[300px] flex-col md:pr-4">
                <label htmlFor="ratS" className="block font-semibold text-zinc-700">RAT Senior</label>
                <input type="text" value={formData.Ratsenior} id="ratS" className="capitalize rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" readOnly />
              </div>       
                <div className="flex w-[300px] flex-col md:pr-4">
                  <label htmlFor="codratS" className="block font-semibold text-zinc-700">Código RAT Senior</label>
                  <input type="number" value={formData.codigoRATS} id="codratS" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" readOnly />
                </div>       
            </div>
            <div className="mb-4 flex flex-row flex-wrap">
              <div className="flex w-[380px] flex-col md:pr-4">
                <label htmlFor="anexo" className="block font-semibold text-zinc-700">Anexo RAT Senior</label>
                <a href={formData.Anexo} download="arquivo.pdf" className="block font-semibold text-blue-700" onClick={pdfDowload}>
                  Baixar Anexo
                </a>
              </div>       
              <div className="flex w-[200px] flex-col md:pr-4">
                <label htmlFor="data" className="block font-semibold text-zinc-700">Data de Lançamento</label>
                <input type="date" value={formData.Data} id="Data" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" readOnly />
              </div>
              <div className="flex w-[300px] flex-col md:pr-4">
                <label htmlFor="status" className="block font-semibold text-zinc-700">Status</label>
                <input type="text" value={formData.Stats} id="stats" className="rounded-md border border-zinc-400 px-2 py-1 text-black focus:border-blue-500 focus:outline-none" readOnly />
              </div>
            </div>
          </form>
        )}
      </div>
      <RatTable />
    </DefaultLayout>
  );
}
