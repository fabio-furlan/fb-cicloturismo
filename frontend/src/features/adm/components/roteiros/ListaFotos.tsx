import { tiposImagem } from '../../config/rotulos'
import { novaImagem, type ImagemForm } from '../../utils/formularioRoteiro'
import { Botao } from '../ui/Botao'
import { Campo, Selecao } from '../ui/campos'
import { Cartao } from '../ui/Cartao'

interface ListaFotosProps {
  imagens: ImagemForm[]
  aoMudar: (imagens: ImagemForm[]) => void
}

/** As fotos do roteiro, com a prévia de cada endereço informado. */
export function ListaFotos({ imagens, aoMudar }: ListaFotosProps) {
  const mudarImagem = (chave: number, parcial: Partial<ImagemForm>) =>
    aoMudar(imagens.map((i) => (i.chave === chave ? { ...i, ...parcial } : i)))
  // A primeira foto vira o banner; as seguintes, galeria. Um banner no máximo.
  const adicionar = () => aoMudar([...imagens, novaImagem(imagens.some((i) => i.tipo === 'BANNER') ? 'GALERIA' : 'BANNER')])

  return (
    <Cartao titulo="Fotos">
      <p className="-mt-2 mb-4 text-sm text-cinza-400">
        Endereço de cada foto (por exemplo, <code className="text-creme-100">/images/roteiros/vale-europeu.jpg</code> para uma imagem do
        site). Um banner no máximo: ele aparece no cartão do site.
      </p>
      {imagens.length > 0 && (
        <ul className="space-y-4">
          {imagens.map((imagem) => (
            <li key={imagem.chave} className="rounded-xl border border-white/10 bg-carvao-950/40 p-4">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                    <Selecao
                      rotulo="Tipo"
                      valor={imagem.tipo}
                      opcoes={tiposImagem}
                      aoMudar={(tipo) => mudarImagem(imagem.chave, { tipo })}
                    />
                    <Campo
                      rotulo="Endereço (URL)"
                      required
                      maxLength={500}
                      value={imagem.url}
                      onChange={(e) => mudarImagem(imagem.chave, { url: e.target.value })}
                    />
                  </div>
                  <Campo
                    rotulo="Descrição da foto"
                    required
                    maxLength={255}
                    value={imagem.descricao}
                    onChange={(e) => mudarImagem(imagem.chave, { descricao: e.target.value })}
                    ajuda="O que aparece na foto, para quem usa leitor de tela."
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo
                      rotulo="Autor (crédito)"
                      maxLength={120}
                      value={imagem.autor}
                      onChange={(e) => mudarImagem(imagem.chave, { autor: e.target.value })}
                    />
                    <Campo
                      rotulo="Origem (link)"
                      maxLength={500}
                      value={imagem.origem}
                      onChange={(e) => mudarImagem(imagem.chave, { origem: e.target.value })}
                    />
                  </div>
                </div>
                {imagem.url.trim() && (
                  <img src={imagem.url.trim()} alt="" className="aspect-[16/10] w-full rounded-lg bg-carvao-950 object-cover" />
                )}
              </div>
              <button
                type="button"
                onClick={() => aoMudar(imagens.filter((i) => i.chave !== imagem.chave))}
                className="mt-3 text-sm font-semibold text-alerta-300 hover:underline"
              >
                Remover foto
              </button>
            </li>
          ))}
        </ul>
      )}
      <Botao variante="secundario" className={imagens.length ? 'mt-4' : ''} onClick={adicionar}>
        + Adicionar foto
      </Botao>
    </Cartao>
  )
}
