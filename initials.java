import java.util.Scanner;

class initials
{
    public static void main (String [] a)
    {
        printHO();
        
        return;
    } // END main

    // Prints a large H using smaller Hs
   public static void printH ()
    {
        System.out.println("H    H");
        System.out.println("H    H");
        System.out.println("HHHHHH");
        System.out.println("H    H");
        System.out.println("H    H");
        System.out.println("");

        return;
    } // END printH

    // Prints a large O using smaller Os
    public static void printO ()
    {
        System.out.println(" OOOO ");
        System.out.println("O    O");
        System.out.println("O    O");
        System.out.println("O    O");
        System.out.println(" OOOO ");
        System.out.println("");

        return;
    } //END printO

    //Prints each letter in turn by calling the individual methods
    public static void printHO ()
    {
        printH();
        printO();
        return;
    } //END printHO
} // END class name