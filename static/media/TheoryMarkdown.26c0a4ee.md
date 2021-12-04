## Quickstart

The DFT splits a pitch-class vector into 6 components that roughly correspond to periodicities that can be present in this vector. The components represent periodicities with respect to the intervals minor second, major second, major third, minor third, perfect fifth, and the tritone. For example, a diminished chord like `B° = {11, 2, 5}` has a very high periodicity in the 4th component, which corresponds to the minor third.

Let’s take the anacrusis of Scriabin’s op. 52/3 (1907) “Languorous Poem (Pas vite)” as a real-world example.
If we count each quarter note as 1, then its pitch-class content can be represented as the _pitch-class vector_ (PCV):

`x = (1.5, 0, 1, 0, 1, 1, 0, 0.5, 0, 0, 1.5, 0)`

Each entry of this vector corresponds to a pitch class, beginning with C, C#, D, etc. Go to the Analysis page and copy the vector into the “Custom Pitch-Class Vectors” field. You see that it is added to the collection of PCVs and is associated with a specific symbol that is mapped to the PCV’s position on the six Fourier coefficients.

The DFT maps this vector to a 12-dimensional complex number, where each of the 12 components is called a _Fourier coefficient_. But because pitch-class space is symmetric (e.g. going a perfect fifth up is the same as going a perfect fourth down), it is enough to consider only the coefficients 1 through 6. Each of them thus corresponds to a single constant number. We can express this number in polar representation:

$$X[k] = \mu_k \times e^{i\phi_k},$$

where $\mu_k$ represents the vector’s magnitude and $\phi_k$ its phase. Since they together define a position on the 2-dimensional plane, we can associate
, color mapping.

For an in depth introduction to the

## Pitch classes

## Pitch-class vectors

## Discrete Fourier transform

## Color mapping of Fourier coefficients

## A hierarchy of pitch-class vectors

## Wavescapes
