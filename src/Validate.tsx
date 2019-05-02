import React, { useState } from "react";
import "./Validate.scss";
type Val = string | number;

type IValidate = {
  [key: string]: {
    value: string;
    err: string;
  };
};
type InputProps = {
  name: string;
  type: "text" | "tel" | "url" | "email" | "password" | "hidden";
  value?: Val;
  rule?: string;
  placeholder: string;
};
type RadioProps = {
  name: string;
  type: "radio";
  value?: Val;
  rule?: string;
  items: {
    value: Val;
    label: Val;
  }[];
};
type CheckboxProps = {
  name: string;
  type: "checkbox";
  value?: Val;
  rule?: string;
  items: {
    value: Val;
    label: Val;
  }[];
};
type SelectProps = {
  name: string;
  value?: Val;
  rule?: string;
  items: {
    value: Val;
    label: Val;
  }[];
};
type IconProps = {
  label: string;
  className: string;
};
type Rule = {
  require: boolean | Function;
  type?: Array<string | { [key: string]: number }>;
  msg: {
    [key: string]: string;
  };
};

const allRules: {
  [key: string]: Rule;
} = {
  namae: {
    require: true,
    type: [{ maxLength: 20 }],
    msg: {
      require: "必須項目です。",
      maxLength: "20文字以内で入力してください"
    }
  },
  hurigana: {
    require: false,
    type: ["kana", { maxLength: 20 }],
    msg: {
      kana: "カタカナで入力してください。",
      maxLength: "20文字以内で入力してください"
    }
  },
  pref: {
    require: true,
    msg: {
      require: "必須項目です。"
    }
  },
  mail: {
    require: false,
    type: ["email", { maxLength: 20 }],
    msg: {
      require: "必須項目です。",
      maxLength: "20文字以内で入力してください",
      email: "メールアドレスの形式で入力してください。"
    }
  }
};

const validate = (val: Val, rule: Rule): string => {
  let requireFlg = false;
  // 必須チェック
  if (typeof rule.require === "function") {
    requireFlg = rule.require();
  } else {
    requireFlg = rule.require;
  }
  if (requireFlg && val === "") {
    return "require";
  }
  // typeチェック
  if (!rule.type) {
    return "";
  }
  for (let i = 0; i < rule.type.length; i++) {
    const type = rule.type[i];
    // メアド型
    if (val !== "" && type === "email") {
      if (!String(val).match(/^[^@]+@.+\..+$/)) {
        return type;
      }
    }
    // カタカナ型
    if (val !== "" && type === "kana") {
      if (!String(val).match(/^[ァ-ヶー　]*$/)) {
        return type;
      }
    }
    // 最大値/最小値/文字数チェック
    if (typeof type === "object") {
      const typeNameArr = Object.keys(type);
      for (let j = 0; j < typeNameArr.length; j++) {
        const typeName = typeNameArr[j];
        if (typeName === "maxLength") {
          if (type[typeName] < String(val).length) {
            return "maxLength";
          }
        }
        if (typeName === "minValue") {
          if (type[typeName] > Number(val)) {
            return "minValue";
          }
        }
        if (typeName === "miaxValue") {
          if (type[typeName] < Number(val)) {
            return "miaxValue";
          }
        }
      }
    }
  }
  return "";
};

const Input: React.FC<RadioProps | CheckboxProps | InputProps> = props => {
  if (props.type === "radio") {
    return <InputRadio {...props} />;
  } else if (props.type === "checkbox") {
    return <InputCheckbox {...props} />;
  } else {
    return <InputText {...props} />;
  }
};

const InputText: React.FC<InputProps> = props => {
  const [state, saveState] = useState();
  return (
    <div className="form__wrap">
      <input
        type={props.type}
        name={props.name}
        value={state[props.name]!.value}
        placeholder={props.placeholder}
        onChange={e => handleChange(e, props)}
        className="form__input"
      />
      <div className={`form__error ${state[props.name].err ? "is-error" : ""}`}>
        {state[props.name].err}
      </div>
    </div>
  );
};

const InputRadio: React.FC<RadioProps> = props => {
  const [state, saveState] = useState();
  return (
    <div className="">
      {props.items.map(item => {
        return (
          <label className="form__wrap" key={item.label}>
            <input
              type={props.type}
              name={props.name}
              value={item.value}
              onChange={e => handleChange(e, props)}
              className="form__radio"
            />
            <div className="form__label">{item.label}</div>
          </label>
        );
      })}
      <div className={`form__error ${state[props.name].err ? "is-error" : ""}`}>
        {state[props.name].err}
      </div>
    </div>
  );
};

const InputCheckbox: React.FC<CheckboxProps> = props => {
  const [state, saveState] = useState();
  return (
    <div className="">
      {props.items.map(item => {
        return (
          <label className="form__wrap" key={item.label}>
            <input
              type={props.type}
              name={props.name}
              value={item.value}
              onChange={e => handleChange(e, props)}
              className="form__checkbox"
            />
            <div className="form__label">{item.label}</div>
          </label>
        );
      })}
      <div className={`form__error ${state[props.name].err ? "is-error" : ""}`}>
        {state[props.name].err}
      </div>
    </div>
  );
};

const Select: React.FC<SelectProps> = props => {
  const [state, saveState] = useState();
  return (
    <div className="form__wrap">
      <label className="form__select-wrap">
        <select
          name={props.name}
          value={state[props.name].value}
          onChange={e => handleChange(e, props)}
          className="form__select"
        >
          {props.items.map(item => {
            return (
              <option value={item.value} key={item.label}>
                {item.label}
              </option>
            );
          })}
        </select>
      </label>
      <div className={`form__error ${state[props.name].err ? "is-error" : ""}`}>
        {state[props.name].err}
      </div>
    </div>
  );
};

const Icon = (props: IconProps) => {
  return <span className={props.className}>{props.label}</span>;
};

const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  props: React.PropsWithChildren<
    InputProps | RadioProps | CheckboxProps | SelectProps
  >
) => {
  const [state, saveState] = useState();
  const val = event.currentTarget.value;
  let errMsg = "";
  // ルール定義がある場合のみ実行
  if (allRules[props.name]) {
    const rule = allRules[props.name];
    const result: string = validate(val, rule);
    if (result) {
      errMsg = rule.msg[result];
    }
  }
  const newState = { ...state };
  newState[props.name] = {
    value: val,
    err: errMsg
  };
  saveState(newState);
};

const handleClick = () => {
  const [state, saveState] = useState();
  const nameArr = Object.keys(state);
  const newState = { ...state };
  nameArr.forEach(name => {
    const val = state[name].value;
    const rule = allRules[name];
    if (rule) {
      const result: string = validate(val, rule);
      if (result) {
        newState[name]["err"] = rule.msg[result];
      }
    }
  });
  saveState(newState);
};

const Validate: React.FC = () => {
  const [state, saveState] = useState<IValidate>({
    namae: { value: "", err: "" },
    hurigana: { value: "", err: "" },
    sex: { value: "", err: "" },
    pref: { value: "", err: "" },
    mail: { value: "", err: "" },
    mailmag: { value: "", err: "" }
  });
  const errArr: string[] = Object.values(state).map(item => {
    return item.err;
  });
  const errFlg = errArr.some(err => {
    return err !== "";
  });
  return (
    <form name="hoge" method="POST" action="./confirm/" className="">
      <table className="table">
        <tbody>
          <tr>
            <th className="table__th">
              お名前
              <Icon className="icon--require" label="必須" />
            </th>
            <td className="table__td">
              <Input name="namae" type="text" value="" placeholder="お名前" />
            </td>
          </tr>
          <tr>
            <th className="table__th">フリガナ</th>
            <td className="table__td">
              <Input
                name="hurigana"
                type="text"
                value=""
                placeholder="フリガナ"
              />
            </td>
          </tr>
          <tr>
            <th className="table__th">性別</th>
            <td className="table__td">
              <Input
                name="sex"
                type="radio"
                value=""
                items={[
                  { value: 0, label: "男性" },
                  { value: 1, label: "女性" }
                ]}
              />
            </td>
          </tr>
          <tr>
            <th className="table__th">
              都道府県
              <Icon className="icon--require" label="必須" />
            </th>
            <td className="table__td">
              <Select
                name="pref"
                value=""
                items={[
                  { value: "", label: "選択してください" },
                  { value: 1, label: "北海道" }
                ]}
              />
            </td>
          </tr>
          <tr>
            <th className="table__th">メールアドレス</th>
            <td className="table__td">
              <Input
                name="mail"
                type="email"
                value=""
                placeholder="example@example.com"
              />
              <Input
                name="mailmag"
                type="checkbox"
                value=""
                items={[{ value: 1, label: "メールマガジンを受け取る" }]}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="btn__wrap">
        <button
          className="btn--submit"
          onClick={() => handleClick()}
          disabled={errFlg}
        >
          送信
        </button>
      </div>
    </form>
  );
};

export default Validate;
