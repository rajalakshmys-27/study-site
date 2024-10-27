import React, { Fragment, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useSelector } from "react-redux";
import { RootState } from "../../slice/RootReducer";
import { useDispatch } from "react-redux";
import { gitCommandsDataRequest } from "../../slice/gitCommandSlice";

import styles from "./gitPage.module.scss";
import { CheckIcon, CopyIcon } from "../../icons";

const GitPage: React.FC = () => {
  const [copied, setCopied] = useState<{ [key: number]: boolean }>({});

  const gitCommandsData = useSelector(
    (state: RootState) => state.gitCommands.gitCheatSheetDetails
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(gitCommandsDataRequest());
  }, [dispatch]);

  const handleCopy = (index: number) => {
    setCopied((prevState) => ({ ...prevState, [index]: true }));
    setTimeout(() => {
      setCopied((prevState) => ({ ...prevState, [index]: false }));
    }, 2000);
  };
  return (
    <div className={styles["git-wrapper"]}>
      <div className={styles["git-page"]}>
        <div className={styles["heading-container"]}>
          <h1>Git Cheatsheet</h1>
          <p>
            Discover essential Git commands and tips in our concise cheatsheet,
            perfect for streamlining your version control workflow.
          </p>
        </div>
        <img
          src="/assets/git.png"
          className={styles["git-image"]}
          alt="git diagram"
        />
        <div className={styles["cheatsheet-container"]}>
          {gitCommandsData.gitCommands?.map((item, index) => (
            <div key={index} className={styles["command-wrapper"]}>
              <h4>{item.topic}</h4>
              {item.commands?.map((cmd) => (
                <Fragment key={cmd.id}>
                  <p>{cmd.description}</p>
                  <div className={styles["command-container"]}>
                    <SyntaxHighlighter language="bash" style={darcula}>
                      {cmd.command}
                    </SyntaxHighlighter>
                    <CopyToClipboard
                      text={cmd.command}
                      onCopy={() => handleCopy(cmd.id)}
                    >
                      <span className={styles["copy-button"]}>
                        {copied[cmd.id] ? <CopyIcon /> : <CheckIcon />}
                      </span>
                    </CopyToClipboard>
                  </div>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitPage;
