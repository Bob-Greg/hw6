import React, {useState} from 'react';
import './App.css';
import {TextBox} from "./text-box";

function App() {

    const [stIdx, setStIdx] = useState(0)
    const [edIdx, setEdIdx] = useState(1000)
    const MAX_REPRESENTABLE_ARMSTRONG_NUM = 4338281769391371

    function getNums() {
        let list: number[] = []
        let powers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        let power = 10
        for (let i = stIdx; i <= edIdx; i++) {
            if (i === power) {
                power *= 10
                for (let i = 0; i < 10; i++) {
                    powers[i] *= i;
                }
            }
            let sum = 0;
            let j = i
            let rem = 0
            while (j) {
                rem = j % 10;
                sum += powers[rem];
                j = ~~(j / 10)
            }
            if (sum === i) {
                list.push(sum)
            }
        }
        return list
    }

    function getNumsOptimized(maxN: number, min: number, max: number) {
        maxN = Math.floor(Math.log10(max)) + 1
        let minN = Math.max(0, Math.floor(Math.log10(min)) + 1)
        let pows: Array<Array<number>> = []
        let digitsMultiSet: number[] = []
        let testMultiSet: number[] = []
        let results: number[] = []
        let N = 0
        let minPow = 0
        let maxPow = 0

        function genPows(N: number) {
            if (N > 20) throw new Error();
            pows = (new Array<Array<number>>(10)).fill(null as unknown as Array<number>).map(() => (new Array<number>(N + 1)).fill(0))
            for (let i = 0; i < 10; i++) {
                let p = 1;
                for (let j = 0; j < N + 1; j++) {
                    pows[i][j] = p;
                    p *= i;
                }
            }
        }

        function check(pow: number) {
            if (pow >= maxPow) return false;
            if (pow < minPow) return false;

            for (let i = 0; i < 10; i++) {
                testMultiSet[i] = 0;
            }

            while (pow > 0) {
                let i = Math.floor(pow % 10);
                testMultiSet[i]++;
                if (testMultiSet[i] > digitsMultiSet[i]) return false;
                pow = Math.floor(pow / 10);
            }

            for (let i = 0; i < 10; i++) {
                if (testMultiSet[i] !== digitsMultiSet[i]) return false;
            }

            return true;
        }

        function search(digit: number, unused: number, pow: number) {
            if (pow >= maxPow) return;

            if (digit === -1) {
                if (check(pow)) {
                    results.push(pow);
                }
                return;
            }

            if (digit === 0) {
                digitsMultiSet[digit] = unused;
                search(digit - 1, 0, pow + unused * pows[digit][N]);
            } else {
                // Check if we can generate more than minimum
                if (pow + unused * pows[digit][N] < minPow) return;

                let p = pow;
                for (let i = 0; i <= unused; i++) {
                    digitsMultiSet[digit] = i;
                    search(digit - 1, unused - i, p);
                    if (i !== unused) {
                        p += pows[digit][N];
                        // Check maximum and break the loop - doesn't help
                        // if (p >= maxPow) break;
                    }
                }
            }
        }

        if (maxN >= 17) throw new Error();

        genPows(maxN);
        digitsMultiSet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        testMultiSet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (N = minN; N <= maxN; N++) {
            minPow = Math.floor(Math.pow(10, N - 1));
            maxPow = Math.floor(Math.pow(10, N));

            search(9, N, 0);
        }

        results = results.filter(num => num >= min && num <= max)
        results.sort((a, b) => a - b)

        return results;
    }

    return (
        <div className={"overflow-auto bg-sky-200 mt-6 mb-6 ml-6 mr-6 fixed wh-full-minus-margin"}>
            Armstrong Nums<br/>
            (https://github.com/bob-greg/hw6)<br/><br/>
            Starting Number:
            <TextBox defaultText={"0"} text={stIdx.toString(10)} customCss={""} onChange={str => {
                let i = parseInt(str)
                if (!isNaN(i)) {
                    if (i > MAX_REPRESENTABLE_ARMSTRONG_NUM) {
                        i = MAX_REPRESENTABLE_ARMSTRONG_NUM
                    }
                    setStIdx(i)
                    setEdIdx(Math.max(edIdx, i))
                } else {
                    setStIdx(0)
                    i = 0
                }
                return i.toString(10)
            }}/>
            Ending Number:
            <TextBox defaultText={"1000"} text={edIdx.toString(10)} customCss={""} onChange={str => {
                let i = parseInt(str)
                if (!isNaN(i) && i > stIdx) {
                    if (i > MAX_REPRESENTABLE_ARMSTRONG_NUM) {
                        i = MAX_REPRESENTABLE_ARMSTRONG_NUM
                    }
                    setEdIdx(i)
                } else {
                    setEdIdx(stIdx)
                    i = stIdx
                }
                return i.toString(10)
            }}/>
            <br/>
            Armstrong Nums in {stIdx}..{edIdx}:
            <ul className={"list-disc list-inside"}>
            {
                getNumsOptimized(16, stIdx, edIdx).map(num => <li key={num}>{num}</li>)
            }
            </ul>
        </div>
    );
}

export default App;
