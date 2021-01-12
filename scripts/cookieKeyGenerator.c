#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <sys/syscall.h>
#include <string.h>

#define BITS 512
#define BYTES (BITS >> 3)

int main(void) {
    char array[BYTES];
    char byteToString[BYTES];

    printf("Generating 64 byte Cookie Key using arc4random...\n");

    arc4random_buf(array, BYTES);

    for(int i = 0; i < BYTES; i++){
        byteToString[i] = (char)array[i];
    }
    
    printf("Generation complete...\n");
    printf("Creating enviromental variable and placing into direnv...\n");

    FILE *direnv;
    direnv = fopen(".envrc", "a");

    if(direnv== NULL){
            printf("\nError: .envrc file not found \n make sure direnv is installed\n");
            exit(1);
    }

    char envVarDec[BYTES + 26]="\n\nexport SESSION_KEY=\"";

    strcat(envVarDec, byteToString);
    strcat(envVarDec, "\"");

    fprintf(direnv, "%s", envVarDec );

    fclose(direnv);
    printf("Enviromental Variable Created...\n");
    printf("Done\n");

    return 0;
}
