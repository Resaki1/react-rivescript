import { RefObject } from "react";
import "./Messages.css";

const Messages = ({
  messages,
  replies,
  dummy,
}: {
  messages: string[];
  replies: string[];
  dummy: RefObject<HTMLLIElement>;
}) => {
  return (
    <ul className="messages">
      {messages.map((message, index) => {
        return (
          <>
            <li key={"message" + index} className="message">
              {message}
            </li>
            {replies[index] && (
              <li key={"reply" + index} className="reply">
                {replies[index]}
              </li>
            )}
          </>
        );
      })}
      {messages.length === 0 && (
        <li>
          Welcome! Start chatting by typing a message into the input field at
          the bottom and then pressing "send".
        </li>
      )}
      <li key="dummy" className="dummy" ref={dummy}>
        -
      </li>
    </ul>
  );
};

export default Messages;
