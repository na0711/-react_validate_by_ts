import React, { useState } from "react";
import "./Validate.scss";
type Val = string | number;

type InputProps = {
  name: string;
  type: string;
  placeholder: string;
  value?: Val;
  rule?: string;
  err?: string;
};
type Rule = {
  require: boolean | Function;
  msg: {
    [key: string]: string;
  };
};

const allRules: {
  [key: string]: Rule;
} = {
  nameKanji: {
    require: true,
    msg: {
      require: "必須項目です。"
    }
  }
};

const validate = (val: Val, rule: Rule) => {
  let requireFlg = false;
  if (typeof rule.require === "function") {
    requireFlg = rule.require();
  } else {
    requireFlg = rule.require;
  }
  if (requireFlg && val === "") {
    return rule.msg.require;
  }
  return "";
};

const Input: React.FC<InputProps> = props => {
  const [state, saveState] = useState({
    value: props.value,
    err: ""
  });
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const val = event.currentTarget.value;
    let errMsg = "";
    // ルール指定やルール定義がなければエラーをクリア
    if (!props.rule || !allRules[props.rule]) {
      errMsg = "";
    } else {
      const rule = allRules[props.rule];
      errMsg = validate(val, rule);
    }
    saveState({ ...state, value: val, err: errMsg });
  };
  return (
    <div className="form__wrap">
      <input
        type={props.type}
        name={props.name}
        value={state.value}
        placeholder={props.placeholder}
        onChange={handleChange}
        className="form__input"
      />
      <div className={`form__error ${state.err ? "is-error" : ""}`}>
        {state.err}
      </div>
    </div>
  );
};

const Radio: React.FC<RadioProps> = props => {
  const [state, saveState] = useState({
    value: props.value,
    err: ""
  });
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const val = event.currentTarget.value;
    let errMsg = "";
    // ルール指定やルール定義がなければエラーをクリア
    if (!props.rule || !allRules[props.rule]) {
      errMsg = "";
    } else {
      const rule = allRules[props.rule];
      errMsg = validate(val, rule);
    }
    saveState({ ...state, value: val, err: errMsg });
  };
  return (
    <div className="form__wrap">
      <input
        type={props.type}
        name={props.name}
        value={state.value}
        placeholder={props.placeholder}
        onChange={handleChange}
        className="form__input"
      />
      <div className={`form__error ${state.err ? "is-error" : ""}`}>
        {state.err}
      </div>
    </div>
  );
};

const Validate: React.FC = props => {
  const sexRadio = [
    {
      val: 0,
      l: "男性"
    },
    {
      val: 0,
      lalen: "女性"
    }
  ];
  return (
    <form name="hoge" method="POST" action="./confirm/" className="">
      <Input
        name="name"
        type="text"
        value="山田太郎"
        placeholder="必須：お名前"
        rule="nameKanji"
      />
      <Input
        name="kana"
        type="text"
        value="ヤマダタロウ"
        placeholder="フリガナ"
        rule="nameKana"
      />
      <Radio name="sex" type="radio" value={} rule="sex" />
    </form>
  );
};

export default Validate;
