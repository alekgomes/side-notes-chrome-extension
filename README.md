# SideNotes

SideNotes é uma extensão para o Google Chrome que auxilia na coleta, visualização e busca de trechos de texto pela internet.
Com SideNotes é possível selecionar uma pedaço de texto e adicioná-lo em sua biblioteca para revisitá-lo posteriormente.

## Como rodar a extensão locamente

Para rodar localmente é preciso carregar a extensão no Google Chrome, para isso:

0 - Faça o build da extensão com `npm run build-extension`

1 - Acesse a página de extensões digitando `chrome://extensions` em uma nova aba 

2 - Ative o "Modo do desenvolvedor " clicando no switch posicionado no canto superior direito

3 - Clique em "Carregar sem compactação"

4 - Navegue até a raiz do projeto e carregue a pasta `dist`
 

## To-do
- [ ] Syncar o IndexedDB entre todas as abas => Adicionados em uma aba devem estar visível em todas

- [ ] Adicionar estilo ao trecho de texto selecionado (highligh)


## Visão Geral Sobre Como funciona
