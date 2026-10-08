package br.com.fbcicloturismo.compartilhado.api;

import br.com.fbcicloturismo.compartilhado.dominio.NaoAutenticadoException;
import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Converte as exceções da aplicação em respostas no formato Problem Details (RFC 9457). Os erros do próprio Spring
 * MVC, como falha de validação, já saem nesse formato pela classe base.
 */
@RestControllerAdvice
public class TratadorDeErros extends ResponseEntityExceptionHandler {

	@ExceptionHandler
	ProblemDetail naoAutenticado(NaoAutenticadoException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage());
	}

	@ExceptionHandler
	ProblemDetail recursoNaoEncontrado(RecursoNaoEncontradoException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
	}

	@ExceptionHandler
	ProblemDetail regraDeNegocio(RegraDeNegocioException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_CONTENT, e.getMessage());
	}

	@ExceptionHandler
	ProblemDetail alteracaoConcorrente(ObjectOptimisticLockingFailureException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
				"O registro foi alterado por outra operação. Recarregue e tente de novo.");
	}

}
