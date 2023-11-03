export const searchIP = (array, item) => {
    let left = 0;
    let right = array.length - 1;

    if (item >= array[array.length - 1]) {
        return array.length - 1
    }
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (array[mid] === item) {
            return mid;
        } else if (array[mid] < item) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (item > array[right] && item < array[left]) {
        return right;
    }
}