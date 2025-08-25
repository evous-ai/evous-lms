import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import { getCompanyData, getCoursesData } from '@/lib/hooks-server'

export default async function ExemploUsoServerPage() {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  // Exemplo 1: Usar função para dados da empresa
  const companyData = await getCompanyData(profile?.company_id || '')
  
  // Exemplo 2: Usar função para dados de cursos
  const coursesData = await getCoursesData(user.id, 4)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Exemplo de Uso das Funções Server-Side</h1>
      
      {/* Dados da Empresa */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dados da Empresa</h2>
        {companyData.error ? (
          <p className="text-red-600">Erro: {companyData.error}</p>
        ) : (
          <div>
            <p>Total de categorias: {companyData.categorias.length}</p>
            <ul className="list-disc list-inside">
              {companyData.categorias.map(cat => (
                <li key={cat.id}>{cat.name}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      
      {/* Dados dos Cursos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dados dos Cursos</h2>
        {coursesData.error ? (
          <p className="text-red-600">Erro: {coursesData.error}</p>
        ) : (
          <div>
            <p>Total de cursos: {coursesData.cursos.length}</p>
            <ul className="list-disc list-inside">
              {coursesData.cursos.map(course => (
                <li key={course.id}>{course.title}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      
      {/* Informações do Usuário */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
        <p>ID: {user.id}</p>
        <p>Email: {user.email}</p>
        <p>Nome: {profile?.full_name || 'Não informado'}</p>
        <p>Empresa ID: {profile?.company_id || 'Não informado'}</p>
      </section>
    </div>
  )
}
