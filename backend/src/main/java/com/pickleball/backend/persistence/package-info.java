/**
 * Shared persistence conventions.
 * <p>
 * Associations are unidirectional ({@code ManyToOne} from child to parent) to avoid
 * accidental cascade loads and N+1 through bidirectional collections.
 */
package com.pickleball.backend.persistence;
