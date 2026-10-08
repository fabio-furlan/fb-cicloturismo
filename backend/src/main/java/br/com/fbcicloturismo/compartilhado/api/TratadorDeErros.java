package br.com.fbcicloturismo.compartilhado.api;

import br.com.fbcicloturismo.compartilhado.dominio.NaoAutenticadoException;
import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Converte as exceções da aplicação em respostas no formato Problem Details (RFC 9457). Os erros do próprio Spring
 * MVC já saem nesse formato pela classe base; a falha de validação ganha a lista dos campos com problema.
 */
@RestControllerAdvice
public class TratadorDeErros extends ResponseEntityExceptionHandler {

	/**
	 * Corpo com campos inválidos: o {@code detail} diz quais, e a propriedade {@code campos} os lista um a um, para o
	 * painel apontar cada erro. As mensagens saem no idioma do cabeçalho Accept-Language (o navegador manda pt-BR).
	 */
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException e, HttpHeaders headers,
			HttpStatusCode status, WebRequest request) {
		List<Map<String, String>> campos = e.getBindingResult().getFieldErrors().stream()
				.map(erro -> Map.of("campo", erro.getField(), "mensagem",
						Objects.requireNonNullElse(erro.getDefaultMessage(), "valor inválido")))
				.toList();
		ProblemDetail problema = e.getBody();
		problema.setDetail(campos.isEmpty() ? "Dados inválidos." : campos.stream()
				.map(campo -> campo.get("campo") + ": " + campo.get("mensagem"))
				.collect(Collectors.joining("; ", "Confira os campos. ", ".")));
		problema.setProperty("campos", campos);
		return handleExceptionInternal(e, problema, headers, status, request);
	}

	/** JSON mal formado ou com valor do tipo errado (texto onde se espera número, opção que não existe). */
	@Override
	protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException e, HttpHeaders headers,
			HttpStatusCode status, WebRequest request) {
		ProblemDetail problema = ProblemDetail.forStatusAndDetail(status,
				"O corpo da requisição não é um JSON válido ou tem um campo com valor do tipo errado.");
		return handleExceptionInternal(e, problema, headers, status, request);
	}

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
