import { BigNumber } from "@0x/utils";
import Web3 from "web3";
import { Autocomplete, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import classNames from "classnames/bind";
import { CoinGeckoClient } from "coingecko-api-v3";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { format } from "../../helpers/common";
import { getCHNBalance } from "../../helpers/ContractService";
import AreaChart from "../chart/AreaChart";
import { setCurrencyList, setSelectedCurrency } from "../chart/redux/currency";
import style from "./Main.module.scss";
const cx = classNames.bind(style);

const useStyles: any = makeStyles(() => ({
  root: {
    width: "10%",
    "& > .css-17vbkzs-MuiFormControl-root-MuiTextField-root": {
      marginTop: 0,
    },
  },
  inputRoot: {
    background: "var(--main-background-dropdow)",
    "&.MuiOutlinedInput-root": {
      borderRadius: "18px",
    },
  },
  input: {
    color: "var(--btn-hover-blue-green) !important",
  },
  endAdornment: {
    "& > .MuiAutocomplete-clearIndicator": {
      display: "none",
    },
    "& > .MuiAutocomplete-popupIndicator": {
      color: "var(--btn-hover-blue-green)",
    },
  },
}));

const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

const Main: React.FC = () => {
  const classes = useStyles();
  // const wallet = useAppSelector((state) => state.wallet);
  const [currencies, setCurrencies] = useState([""]);
  const dispatch = useDispatch();
  const [totalSupply, setTotalSupply] = useState("0");

  const getCurrencies = useCallback(async () => {
    const coinGeckoCurrencies =
      await coinGeckoClient.simpleSupportedCurrencies();
    setCurrencies(coinGeckoCurrencies);
    dispatch(setCurrencyList(coinGeckoCurrencies));
  }, [dispatch]);

  const handleOnChangeSelectCurrency = (event: any, value: any) => {
    dispatch(setSelectedCurrency(value || "usd"));
  };

  const getTotalSupply = async () => {
    // const totalSup = await getCHNBalance().methods.totalSupply().call();
    // setTotalSupply(
    //   format(new BigNumber(totalSup).div(1e18).toFixed(4).toString())
    // );
  };

  useEffect(() => {
    getCurrencies();
    getTotalSupply();
  }, [getCurrencies]);

  return (
    <div className={cx("text-head")}>
      <div className={cx("text-head-child")}>
        <div className={cx("price")}>${totalSupply}</div>
        <Autocomplete
          classes={classes}
          options={currencies}
          defaultValue={"usd"}
          onChange={handleOnChangeSelectCurrency}
          renderInput={(item) => (
            <TextField {...item} margin="normal" fullWidth />
          )}
          size={"small"}
          id="combo-box-demo"
        />
      </div>
      <div className={cx("securing-chain")}>Securing chain governance</div>
      <AreaChart />
    </div>
  );
};
export default Main;
