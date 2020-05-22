import React, {useState, useEffect, FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {FiChevronRight} from 'react-icons/fi';
import api from '../../services/api';
import logoImg from '../../assets/logo.svg'

import {Title, Form, Repositories, Error} from './styles';

interface Repositorie{
  full_name: string;
  description: string;
  owner:{
    login: string;
    avatar_url: string;
  }
}

// Function Component
const Dashboard: React.FC = () =>{
  const [newRepository, setNewRepository] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repositorie[]>(() =>{
    const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');
    if(storageRepositories){
      return JSON.parse(storageRepositories);
    }
    return [];
  });

  useEffect(() =>{

  },[]);

  useEffect(()=>{
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  },[repositories])


  async function handleAddRepository(event: FormEvent<HTMLFormElement>):Promise<void>{
    event.preventDefault();

    if(!newRepository){
      setInputError('Digite o autor/nome do repositório')
    }
    else{
      try{
        const response = await api.get<Repositorie>(`repos/${newRepository}`);
        const repository = response.data;
        setRepositories([... repositories,  repository]); 
        setNewRepository('')
        setInputError('');
      }catch(erro){
        setInputError('Erro na busca do repositório');
      }
    }
  }



  return (
    <>
    <img src={logoImg} alt="Github Explorer" />
    <Title>Explore os repositórios do Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepository}
          onChange={(e) => setNewRepository(e.target.value)}
          placeholder="Digite o repositorio"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository=>(
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} />
            <div>
              <strong>{repository.owner.login}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20}/>
          </Link>
        ))}
      </Repositories>
    </>

  )
}

export default Dashboard;
