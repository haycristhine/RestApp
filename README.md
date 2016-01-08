## Aplicativo de gerenciamente de mesas e pedidos num restaurante 

=====================Guia=====================

O aplicativo funciona da seguinte forma:
-> O usuário cadastra mesas (que contém um nome (obrigatório) e uma descrição (opcional))
-> O usuário cadastra pratos (que contém um nome e um preço)
-> O usuário cadastra pedidos para uma determinada mesa, que contém o prato pedido e a quantidade

Tomei a liberdade de adicionar uma feature que não foi pedida, pelo menos não explicitamente, que é
a possibilidade de o usuário selecionar quais pedidos foram entregues ou não. E com ela a seguinte 
restrição: O usuário só pode fazer checkout da mesa quando todos os pedidos forem entregues

Algumas funções do app não estão explícitas sendo portanto mais dificil identificá-las,
por esse motivo irei descrevê-las a seguir:

1. Excluir Mesa:
	Para excluir uma mesa basta arrastar o item da lista para a direita

2. Editar Mesa:
	Para editar uma mesa basta arrastar o item da lista para a esquerda

3. Excluir Prato:
	Para excluir um prato basta arrastar o item da lista para a direita

4. Editar Prato:
	Para editar um prato basta arrastar o item da lista para a esquerda

5. Cancelar (excluir) Pedido:
	Para cancelar um pedido basta arrastar o item da lista para a direita

6. Alternar a visualização entre pratos/mesas
	Clicar nos botões na parte superior da tela, logo abaixo do nome do App

Observações:

-- Na tela principal, a bolinha no canto direito do item da mesa indica quantos pedidos faltam serem entregues

-- Ao clicar no item da mesa na página principal o usuário é direcionado para a página de detalhes da mesa, onde pode 
fazer pedidos e realizar o checkout

-- Se uma mesa não possui nenhum pedido seu status fica como "disponível", se uma mesa possui pedidos seu status
fica como "ocupada" e se o numero de pedidos feitos para a mesa for igual ao de pedidos entregues ela está pronta
para o checkout

-- Ao fazer checkout todos os pedidos da mesa são excluidos e seu status volta para disponível
