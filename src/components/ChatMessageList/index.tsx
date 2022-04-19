import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useChat } from '../../contexts/chat.context';
import { useScroll } from '../../hooks/useScroll';
import { ChatMessage } from '../ChatMessage';
import { ChatMessageListBottomScrollButton } from '../ChatMessageListBottomScrollButton';
import { MyChatMessage } from '../MyChatMessage';

// número totalmente arbitrário...
const TAMANHO_MEDIO_MENSAGEM_PX = 300;
export const ChatMessageList = () => {
  const scrollRef: MutableRefObject<Element | null> = useRef(null);
  const { mensagens, buscaMensagem, setMensagens } = useChat();
  const {
    scrollBottom,
    endOfScroll,
    updateEndOfScroll,
    getDistanceFromBottom,
  } = useScroll(scrollRef);
  const [pagina, setPagina] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    scrollRef.current = document.querySelector('#mensagens');
    lerNovasMensagens();
  }, []);

  useEffect(() => {
    updateEndOfScroll();
  }, [mensagens, updateEndOfScroll]);

  useEffect(() => {
    const novaMensagem = mensagens[0];
    const distanceFromBottom = getDistanceFromBottom();
    const lerProximaMensagem = distanceFromBottom < TAMANHO_MEDIO_MENSAGEM_PX;
    const minhaMensagem = novaMensagem?.autor.usuarioAtual;

    if (minhaMensagem || lerProximaMensagem) {
      lerNovasMensagens();
    }
  }, [mensagens.length]);

  const lerNovasMensagens = () => {
    scrollBottom();
    mensagens.forEach((mensagem) => {
      mensagem.lida = true;
    });
    setMensagens([...mensagens]);
  };

  useEffect(() => {
    // Função do javascript que utilizei para observar quando o topo do chat está visível,
    // assim que ele fica visível ocorre a chamada para a pŕoxima página

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setPagina((pagina) => pagina + 1);
      }
    });
    if (containerRef.current)
      intersectionObserver.observe(containerRef.current);

    return () => intersectionObserver.disconnect();
  }, []);

  return (
    <div
      id='mensagens'
      className='flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-purple scrollbar-thumb-rounded scrollbar-track-indigo-lighter scrollbar-w-2 scrolling-touch'
    >
      <div ref={containerRef} className='h-10 w-full'></div>
      {[...mensagens]
        .filter((mensagem) =>
          mensagem.texto.match(new RegExp(buscaMensagem, 'i'))
        )
        .slice(0, pagina * 10)
        .reverse()
        .map((mensagem) =>
          mensagem.autor.usuarioAtual ? (
            <MyChatMessage key={mensagem.id} mensagem={mensagem} />
          ) : (
            <ChatMessage key={mensagem.id} mensagem={mensagem} />
          )
        )}

      {!endOfScroll ? (
        <ChatMessageListBottomScrollButton
          onClick={() => lerNovasMensagens()}
          naoLidos={mensagens.filter((m) => !m.lida).length}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
