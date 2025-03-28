# This is a code ground for simulating data conversion.

## FHE-Accelerator
Fully Homomorphic Encryption ([FHE](https://drive.google.com/file/d/1QPPAjLpNZ0THsKhxFqK4Xf8V8mtltYXs/edit)) Acceleration techniques, for the grad-level Privacy-Enhanced Technology (PET) class I am teaching this semester. This is a rich topic that draws heavily from accelerator design and cryptography. My lecture covers the following topics:

* Intro to FHE (a great 6-slide sequence introducing FHE with math, from Ilaria Chillotti)
* FHE ciphertext representation
* Key cipher parameters
* Residue number systems (RNS), for machine-sized parallelism
* Point-Value Multiplication, for O(N) multiplication
* Number Theoretic Transform (NTT), for O(NlogN) generation of point-values
* Cooley-Tukey Algorithm, for mapping NTTs to hardware
* NTT butterfly network design
* FHE acceleration: Compiler optimization, NYU Orion example
* FHE acceleration: CPU vectorization, Intel HEXL example
* FHE acceleration: GPU acceleration, NTT mapping example
* FHE acceleration: FPGA acceleration, Microsoft HEAX example
* FHE acceleration: ASIC acceleration, MIT F1 example
* Comparative analysis: FHE operator performance
* Comparative analysis: End-to-end application performance
* Comparative analysis: Boolean FHE performance
* Comparative analysis: VIP-Bench benchmark suite
