import { readFileSync } from "fs";

console.time('Giveaway');
let array = [];
let map = new Map();

for (let i = 0; i < 20; i++) {
    array = mergeSort(Array.from(new Set(readFileSync(`C:/serverless-academy/06_Instagram_Giveaway/Files/out${i}.txt`, "utf8").split('\n'))));
    for (let value of array) {
        if (map.has(value)) {
            let count = map.get(value)
            map.set(value, count + 1);
        } else {
            map.set(value, 0);
        }
    }
}

uniqueValues(map);
existInAllFiles(map);
existInAllLeastTen(map);
console.timeEnd('Giveaway')

function mergeSort(array) {
    if (array.length < 2) return array
    const middle = Math.floor(array.length / 2)
    const sorted_left = mergeSort(array.slice(0, middle))
    const sorted_right = mergeSort(array.slice(middle, array.length))
    return mergeSortedArrays(sorted_left, sorted_right)
}

function mergeSortedArrays(left, right) {
    const result = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }
    return result;
}

function uniqueValues(map) {
    console.log(map.size);
}

function existInAllFiles(map) {
    let count = 0;
    for (let value of map.values()) {
        if (value === 19) {
            count++;
        }
    }
    console.log(count);
}

function existInAllLeastTen(map) {
    let count = 0;
    for (let value of map.values()) {
        if (value >= 9) {
            count++;
        }
    }
    console.log(count);
}

