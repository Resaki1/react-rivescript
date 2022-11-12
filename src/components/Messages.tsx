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
            <li key={"reply" + index} className="reply">
              {replies[index]}
            </li>
          </>
        );
      })}
      <li className="dummy" ref={dummy}>
        -
      </li>
    </ul>
  );
};

export default Messages;
