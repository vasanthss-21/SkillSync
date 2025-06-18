import java.util.Scanner;

public class Main {

    public static long sumEvenNumbers(int L, int R) {
        if (L % 2 != 0) {
            L++;
        }

        if (R % 2 != 0) {
            R--;
        }

        if (L > R) {
            return 0;
        }

        int n = (R - L) / 2 + 1;
        long sum = (long) n * (L + R) / 2;

        return sum;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int L = scanner.nextInt();
        int R = scanner.nextInt();

        long result = sumEvenNumbers(L, R);
        System.out.println(result);
    }
}