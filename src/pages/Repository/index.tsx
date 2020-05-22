import React,{useEffect, useState} from 'react';
import { useRouteMatch, Link} from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {Header, RepositoryInfo, Issues} from './styles';
import api from '../../services/api';
import logoImg from '../../assets/logo.svg'
import { promises } from 'fs';

interface RepositoryParams{
  repository: string;
}

interface Repository{
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner:{
    login: string;
    avatar_url: string;
  }
}

interface Issues{
  title: string;
  id: number;
  html_url: string;
  user:{
    login: string;
  }
}

// Function Component
const Repository: React.FC = () =>{
  const [repository, setRepository] = useState<Repository|null>(null);
  const [issues, setIssues] = useState<Issues[]>([]);
  const {params} = useRouteMatch<RepositoryParams>();

  useEffect(() =>{
    async function loadData(): Promise<void>{
      const [repository, issues] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`)
      ]);
      setRepository(repository.data);
      setIssues(issues.data);
    }
    loadData();
  },[params.repository]);

  return(
    <>
    <Header>
      <img src={logoImg} alt="Github Explorer"/>
      <Link to="/">
        <FiChevronLeft size={16}/>
          Voltar
      </Link>
    </Header>
    {
    repository && (
    <RepositoryInfo>
      <header>
        <img src={repository?.owner.avatar_url} />
        <div>
          <strong>{repository.full_name}</strong>
          <p>{repository.description}</p>
        </div>
      </header>
      <ul>
        <li>
          <strong>{repository.stargazers_count}</strong>
          <span>Stars</span>
        </li>
        <li>
          <strong>{repository.forks_count}</strong>
          <span>Forks</span>
        </li>
        <li>
          <strong>{repository.open_issues_count}</strong>
          <span>Issues abertas</span>
        </li>
      </ul>
      </RepositoryInfo>
      )}
      <Issues>
      {issues.map(issue =>(
          <a  key={issue.id}  href={issue.html_url} target="_blank">
          <div>
            <strong>{issue.title}</strong>
            <p>{issue.user.login}</p>
          </div>
          <FiChevronRight size={20}/>
          </a>
      ))}
        </Issues>


    </>
  );
}

export default Repository;
