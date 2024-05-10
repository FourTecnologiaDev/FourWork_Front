import React, { useState, useEffect } from 'react';
import { MdMailOutline, MdPersonOutline, MdBusiness } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from './scripts/api';
import Button from './scripts/Button';
import Image from './scripts/Image';
import Four2 from './Four-Tecnologia-Logo-footer.png';
import Title from './scripts/Title';
import { Link, useNavigate } from 'react-router-dom';
import Four from './four-logo.png';

import { ResponseMessage } from './scripts/ResponseMessage';
import './StyleSignUp.css';

const UserFormSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "O email é inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmpassword: z.string().refine(value => value === (document.getElementById("password") as HTMLInputElement).value, { message: "As senhas não coincidem" })
});

type SignUpFormData = z.infer<typeof UserFormSchema>;

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    message: "",
    type: "",
  });
  const [userName, setUserName] = useState("");
  const [userEmpresa, setUserEmpresa] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const empresa = localStorage.getItem("userEmpresa");
    
    if (email && name && empresa) {
      setUserEmail(email);
      setUserName(name);
      setUserEmpresa(empresa);
    }
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(UserFormSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const requestDataUser = { ...data, status: true };
  
      const response = await api.post("/novoUsuario", requestDataUser);
  
      if (response.data.result === "Usuário já existe na base.") {
        setResponse({ message: response.data.result, type: "error" });
        setTimeout(() => setResponse({ message: "", type: "" }), 2100);
      } else {
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmpresa", data.empresa);
  
        navigate("/Table/Table");
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page ">
      <div className="flex justify-center items-center">
        <div className='boxLeft'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="boxRight imgfour md:hidden w-50 h-10 items-center justify-center">
              <Image imageLink={Four2} />
            </div>
            <div className="title hidden md:block" >
              <Title title="Suporte Four" />
            </div>

            <div className="input-box">
              <label htmlFor="name">Nome<i>*</i></label>
              <MdPersonOutline id="icon" className="material-icons" />
              <input
                className="input"
                {...register("name")}
                id="name"
                type="text"
                placeholder="Digite seu nome"
              />
              {errors.name && <p className="error-message">{errors.name.message}</p>}
            </div>


            <div className="input-box">
              <label htmlFor="email">Email<i>*</i></label>
              <MdMailOutline id="icon" className="material-icons" />
              <input
                className="input"
                {...register("email")}
                id="email"
                type="email"
                placeholder="Digite seu email"
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="input-box">
              <label htmlFor="password">Senha<i>*</i></label>
              <MdPersonOutline id="icon" className="material-icons" />
              <input
                className="input"
                {...register("password")}
                id="password"
                type="password"
                placeholder="Digite sua senha"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div className="input-box">
              <label htmlFor="confirmpassword">Confirmar Senha<i>*</i></label>
              <MdPersonOutline id="icon" className="material-icons" />
              <input
                className="input"
                {...register("confirmpassword")}
                id="confirmpassword"
                type="password"
                placeholder="Confirme sua senha"
              />
              {errors.confirmpassword && <p className="error-message">{errors.confirmpassword.message}</p>}
            </div>

            {response.message !== "" && (
              <ResponseMessage message={response.message} type={response.type} />
            )}

            <div className="button-container">
              <Button
                name='button'
                id='button'
                type='submit'
                content={loading ? "Aguarde..." : "Cadastrar"}
                disabled={loading}
              />
            </div>

            <div className="signup-link">
              <p>Já possui uma conta? <Link to="/login" className='text-[#177357] font-bold'>Faça login</Link></p>
            </div>
          </form>
        </div>

        <div className="boxRight hidden md:block">
          <Image imageLink={Four}  />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
